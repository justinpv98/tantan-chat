// Constants
import socketEvents from "@/config/socketEvents";

// Models
import ConversationModel from "@/models/Conversation";
import UnreadMessageModel from "@/models/UnreadMessage";

// Types
import { Message } from "@/models/Message";
import { SocketWithChannels } from "@/config/sockets";

export default function messageHandlers(io: any, socket: SocketWithChannels) {
  socket.on(socketEvents.MESSAGE, async (data: Message) => {
    data.author = socket.user.id;
    const message = new Message(data);
    await message.save();


    const conversation = await ConversationModel.findExistingConversation(
      Number(message.conversation),
      socket.user.id
    );

    message.author = socket.user;

    io.in(conversation.id).emit(socketEvents.MESSAGE, message, conversation);

    await UnreadMessageModel.addUnreadMessage(socket.user.id, message.id, message.conversation)
  });

  socket.on(socketEvents.TYPING, (conversationId: string) => {
    socket.to(conversationId).emit(socketEvents.TYPING, socket.user.username, conversationId);
  });

  socket.on(socketEvents.READ_MESSAGES, async (conversationId: string) => {
    await UnreadMessageModel.deleteAll({where: {conversation: conversationId, reader: socket.user.id}})
  })
}
