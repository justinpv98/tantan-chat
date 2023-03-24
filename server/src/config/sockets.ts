import { allowedOrigins } from "./cors/corsOptions";
import logger from "@/logger";

// Constants
import socketEvents from "./socketEvents";

// Models
import ConversationParticipantModel from "@/models/ConversationParticipant";

// Handlers
import conversationHandlers from "@/socketHandlers/conversationHandlers";
import messageHandlers from "@/socketHandlers/messageHandlers";
import userHandlers from "@/socketHandlers/userHandlers";

// Types
import { Application } from "express";
import { NextFunction, RequestHandler } from "express-serve-static-core";
import { Server } from "http";
import { Session } from "express-session";
import { Socket } from "socket.io";
import UserModel, { UserSchema } from "@/models/User";

declare module "http" {
  interface IncomingMessage {
    session: Session & {
      user: UserSchema;
    };
    sessionID: string;
  }
}

export interface SocketWithChannels extends Socket {
  channels: string[];
  conversations: Set<string>;
  user: UserSchema;
}

export type UserToSocketsMap = {
  [key: string]: {
    sockets: string[];
  };
};

// Caches
const sockets = {};
const users: UserToSocketsMap = {};

function initializeSocket(
  app: Application,
  server: Server,
  sessionMiddleware: RequestHandler
) {
  const io = require("socket.io")(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use(function (socket, next: NextFunction) {
    // share session
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  app.set("io", io);

  io.on("connection", onConnection);

  async function onConnection(socket: SocketWithChannels) {
    socket.request.session.reload(() => {});
    socket.user = { ...socket.request.session.user };
    delete socket.user.email;
    delete socket.user.password;

    sockets[socket.id] = socket;
    socket.conversations = new Set();

    await handleUnidentifiedSocket(socket);
    await joinConversations(socket);
    await connectSocketToUser(socket);

    conversationHandlers(io, socket, sockets, users);
    messageHandlers(io, socket);
    userHandlers(io, socket);

    socket.on("disconnect", async () => {
      await handleDisconnect(socket);
    });
  }
}

/*
/   Utility Functions
/ 
*/

async function handleUnidentifiedSocket(socket: SocketWithChannels) {
  if (!socket.user.id) {
    socket.disconnect();
    logger.debug(`A user's session timed out`);
  } else {
    logger.debug(`User #${socket.user.id} has established a connection`);
  }
}

async function joinConversations(socket: SocketWithChannels) {
  // Handle joining rooms of existing conversations for user;
  const conversations = (await ConversationParticipantModel.findAll({
    select: ["conversation"],
    as: { conversation: "conversation_id" },
    where: { user: socket.user.id },
  })) as unknown as { conversation_id: string }[];

  socket.join(socket.user.id);

  if (conversations) {
    conversations.forEach((conversationData) => {
      const conversationId = conversationData.conversation_id;
      socket.join(conversationId);
      socket.conversations.add(conversationId);
      logger.debug(
        `User #${socket.user.id} has joined conversation #${conversationId}`
      );
    });
  }
}

async function connectSocketToUser(socket: SocketWithChannels) {
  // Handle multiple socket instances of a user
  if (!users[socket.user.id]) {
    users[socket.user.id] = { sockets: [socket.id] };
    socket.to([...socket.conversations]).emit(socketEvents.SET_STATUS, socket.user.id, 2);
    UserModel.updateById(socket.user.id, { set: { status: 2 } });
  } else {
    users[socket.user.id]?.sockets.push(socket.id);
  }
}

async function handleDisconnect(socket: SocketWithChannels) {
  const userId = socket.user.id;
  delete sockets[socket.id];

  const conversations = Array.from(socket.conversations);
  if (users[userId]?.sockets.length === 1) {
    delete users[userId];
    socket.to(conversations).emit(socketEvents.SET_STATUS, userId, 1);
    UserModel.updateById(userId, { set: { status: 1 } });
    logger.debug(`User ${socket.user.id} has disconnected`);
  } else {
    const index = users[userId]?.sockets.indexOf(socket.id);
    users[userId]?.sockets.splice(index, 1);
  }
}

export default initializeSocket;
