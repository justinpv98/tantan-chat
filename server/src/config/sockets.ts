import { allowedOrigins } from "./cors/corsOptions";
import logger from "@/logger";

// Models
import ConversationModel from "@/models/Conversation";
import ConversationParticipantModel from "@/models/ConversationParticipant";
import { Message } from "@/models/Message";

// Types
import { Application } from "express";
import { MessageSchema } from "@/models/Message";
import { RequestHandler } from "express-serve-static-core";
import { Server } from "http";
import { Session } from "express-session";
import { Socket } from "socket.io";
import UserModel, { User, UserSchema } from "@/models/User";

declare module "http" {
  interface IncomingMessage {
    session: Session & {
      user: UserSchema;
    };
    sessionID: string;
  }
}

interface SocketWithChannels extends Socket {
  channels: string[];
  conversations: Set<string>;
  user: UserSchema;
}

// Caches
const sockets = {};
const users = {};

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

  const statuses = [1, 2, 3, 4];

  io.use(function (socket, next) {
    // share session
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  app.set("io", io);

  io.on("connection", async (socket: SocketWithChannels) => {
    socket.request.session.reload(() => {});
    socket.user = { ...socket.request.session.user };

    sockets[socket.id] = socket;
    socket.conversations = new Set();

    await handleUnidentifiedSocket(socket);
    await joinConversations(socket);
    await connectSocketToUser(socket);

    socket.on("setStatus", (status: number) => {
      if (!statuses.includes(status)) return;
      const userId = socket.user.id;
      socket.to([...socket.rooms]).emit("setStatus", userId, status);

      UserModel.updateById(userId, { set: { status } });
    });

    socket.on("createConversation", (conversationId: string) => {
      socket.join(conversationId);
      logger.debug(
        `User #${socket.user.id} has joined conversation #${conversationId}`
      );
    });

    socket.on("message", async (data: MessageSchema) => {
      data.author = socket.user.id;
      const message = new Message(data);
      await message.save();

      const conversation = await ConversationModel.findExistingConversation(
        message.conversation,
        message.author
      );

      let spliceIndex;
      for (let i = 0; i < conversation.participants.length; i++) {
        if (conversation.participants[i].id === socket.user.id) {
          spliceIndex = i;
          break;
        }
      }

      if (spliceIndex !== undefined) {
        const filteredParticipants = conversation.participants.splice(
          spliceIndex,
          1
        );
        conversation.participants = filteredParticipants;
      }

      io.emit("message", message, conversation);
    });

    socket.on("typing", (conversationId: string) => {
      socket.to(conversationId).emit("typing", socket.user.username);
    });

    socket.on("disconnect", async () => {
      await handleDisconnect(socket);
    });
  });
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
    users[socket.user.id] = [socket.id];
    socket.to([...socket.conversations]).emit("setStatus", socket.user.id, 2);
    UserModel.updateById(socket.user.id, { set: { status: 2 } });
  } else {
    users[socket.user.id].push(socket.user.id);
  }
}

async function handleDisconnect(socket: SocketWithChannels) {
  const userId = socket.user.id;
  delete sockets[socket.id];

  const conversations = Array.from(socket.conversations);
  if (users[userId].length === 1) {
    delete users[userId];
    socket.to(conversations).emit("setStatus", userId, 1);
    UserModel.updateById(userId, { set: { status: 1 } });
    logger.debug(`User ${socket.user.id} has disconnected`);
  } else {
    const index = users[userId].indexOf(socket.id);
    users[userId].splice(index, 1);
  }
}

export default initializeSocket;
