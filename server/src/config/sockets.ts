import { allowedOrigins } from "./cors/corsOptions";
import logger from "@/logger";

// Models
import ConversationModel from "@/models/Conversation";
import ConversationParticipantModel from "@/models/ConversationParticipant";
import { Message } from "@/models/Message";
import RelationshipModel, { Relationship } from "@/models/Relationship";

// Types
import { Application } from "express";
import { MessageSchema } from "@/models/Message";
import { RequestHandler } from "express-serve-static-core";
import { Server } from "http";
import { Session } from "express-session";
import { Socket } from "socket.io";
import UserModel, { UserSchema } from "@/models/User";

interface MessageSchemaWithFile extends MessageSchema {
  file?: string;
}

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

type UserToSocketsMap = {
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

  const statuses = [1, 2, 3, 4];

  io.use(function (socket, next) {
    // share session
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  app.set("io", io);

  io.on("connection", async (socket: SocketWithChannels) => {
    socket.request.session.reload(() => {});
    socket.user = { ...socket.request.session.user };
    delete socket.user.email;
    delete socket.user.password;

    sockets[socket.id] = socket;
    socket.conversations = new Set();

    await handleUnidentifiedSocket(socket);
    await joinConversations(socket);
    await connectSocketToUser(socket);

    socket.on("setStatus", (status: number) => {
      if (!statuses.includes(status)) return;
      const userId = socket.user.id;
      socket.to([...socket.conversations]).emit("setStatus", userId, status);

      UserModel.updateById(userId, { set: { status } });
    });

    socket.on(
      "createConversation",
      async (conversationId: string, targetIDs: string[], type?: 1 | 2) => {
        socket.join(conversationId);

        logger.debug(
          `User #${socket.user.id} has joined conversation #${conversationId}`
        );

        targetIDs.forEach((targetID) => {
          const targetSockets = users[targetID]?.sockets;
          if (targetSockets && targetSockets.length) {
            targetSockets.forEach((socketId) => {
              sockets[socketId].join(conversationId);
              logger.debug(
                `User #${targetID} has joined conversation #${conversationId}`
              );
            });
          }
        });

        if (type === 2) {
          const conversation = await ConversationModel.findExistingConversation(
            conversationId
          );

          console.log(conversation);

          io.in(conversation.id).emit("createGroupDM", conversation);
        }
      }
    );

    socket.on("changeConversationName", async ({ conversationId, name }) => {

      const newName = name.slice(0, 64);
      io.in(Number(conversationId)).emit(
        "changeConversationName",
        conversationId,
        newName
      );

      await ConversationModel.updateById(conversationId, {
        set: {
          name,
        },
      });
    });

    socket.on("message", async (data: MessageSchemaWithFile) => {
      data.author = socket.user.id;
      const message = new Message(data);
      await message.save();

      const conversation = await ConversationModel.findExistingConversation(
        message.conversation
      );

      message.author = socket.user;

      io.in(conversation.id).emit("message", message, conversation);
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
    socket.to([...socket.conversations]).emit("setStatus", socket.user.id, 2);
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
    socket.to(conversations).emit("setStatus", userId, 1);
    UserModel.updateById(userId, { set: { status: 1 } });
    logger.debug(`User ${socket.user.id} has disconnected`);
  } else {
    const index = users[userId]?.sockets.indexOf(socket.id);
    users[userId]?.sockets.splice(index, 1);
  }
}

export default initializeSocket;
