// Constants
import socketEvents from "@/config/socketEvents";

// Models
import UserModel from "@/models/User";

// Types
import { SocketWithChannels } from "@/config/sockets";

const statuses = [1, 2, 3, 4];

export default function userHandlers(io: any, socket: SocketWithChannels) {
    socket.on(socketEvents.SET_STATUS, (status: number) => {
        if (!statuses.includes(status)) return;
        const userId = socket.user.id;
        socket.to([...socket.conversations]).emit(socketEvents.SET_STATUS, userId, status);
  
        UserModel.updateById(userId, { set: { status } });
      });
  
  }
  