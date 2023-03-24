// Constants
import socketEvents from "@/config/socketEvents";

// Models
import ConversationModel from "@/models/Conversation";

// Types
import { Message } from "@/models/Message";
import { SocketWithChannels } from "@/config/sockets";


export default function messageHandlers(io: any, socket: SocketWithChannels) {
  socket.on(socketEvents.MESSAGE, async (data: Message) => {
    data.author = socket.user.id;
    const message = new Message(data);
    await message.save();

    const conversation = await ConversationModel.findExistingConversation(
      message.conversation
    );

    message.author = socket.user;

    io.in(conversation.id).emit(socketEvents.MESSAGE, message, conversation);
  });

  socket.on(socketEvents.TYPING, (conversationId: string) => {
    socket.to(conversationId).emit(socketEvents.TYPING, socket.user.username);
  });
}
