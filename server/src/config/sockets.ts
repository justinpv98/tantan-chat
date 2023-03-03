import { allowedOrigins } from "./cors/corsOptions";
import logger from "@/logger";

// Models
import ConversationModel from "@/models/Conversation";
import { Message } from "@/models/Message";

// Types
import { Application } from "express";
import { MessageSchema } from "@/models/Message";
import { RequestHandler } from "express-serve-static-core";
import { Server } from "http";
import { Session } from "express-session";
import { Socket } from "socket.io";
import { UserSchema } from "@/models/User";

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
  user: UserSchema;
}

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

  io.use(function (socket, next) {
    // share session
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  app.set("io", io);

  // Caches
  const users = {};

  io.on("connection", async (socket: SocketWithChannels) => {
    socket.request.session.reload(() => {});
    socket.user = { ...socket.request.session.user };

    users[socket.id] = socket;

    logger.debug(`User #${socket.user.id} has established a connection`);

    const conversations = await ConversationModel.findAllByParticipant(
      socket.user.id
    );

    if (conversations) {
      conversations.forEach((conversationData) => {
        const conversationId = conversationData.conversation_id
        socket.join(conversationId);
        logger.debug(
          `User #${socket.user.id} has joined conversation #${conversationId}`
        );
      });
    }

    socket.on("createConversation", (conversationId: string) => {
      socket.join(conversationId)
      logger.debug(`User #${socket.user.id} has joined conversation #${conversationId}`)
    })

    socket.on(
      "message",
      async (data: MessageSchema) => {
        data.author = socket.user.id;
        const message = new Message(data);
        await message.save();

        io.to(message.conversation).emit("message", message);
      }
    );

    socket.on("disconnect", () => {
      logger.debug(`Socket ID: ${socket.id} has disconnected`);
    });
  });
}

export default initializeSocket;
