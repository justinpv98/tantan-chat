import logger from "@/logger";

// Constants
import socketEvents from "@/config/socketEvents";

// Models
import ConversationModel from "@/models/Conversation";

// Types
import { SocketWithChannels } from "@/config/sockets";

export default function messageHandlers(
  io: any,
  socket: SocketWithChannels,
  sockets,
  users
) {
  socket.on(
    socketEvents.CREATE_CONVERSATION,
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
          Number(conversationId),
          socket.user.id
        );

        io.in(conversation.id).emit(socketEvents.CREATE_GROUP_DM, conversation);
      }
    }
  );

  socket.on(socketEvents.CHANGE_CONVERSATION_NAME, async ({ conversationId, name }) => {
    const newName = name.slice(0, 64);
    io.in(Number(conversationId)).emit(
      socketEvents.CHANGE_CONVERSATION_NAME,
      conversationId,
      newName
    );

    await ConversationModel.updateById(conversationId, {
      set: {
        name,
      },
    });
  });
}
