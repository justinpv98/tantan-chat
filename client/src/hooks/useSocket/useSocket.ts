import { useContext } from "react";
import { SocketContext } from "@/features/socket/socket.context";

export default function useSocket() {
  // returns Auth Context values
  return useContext(SocketContext);
}