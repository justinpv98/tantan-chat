import { useContext } from "react";
import { socketContext } from "@/features/socket/socket.context";

export default function useSocket() {
  // returns Auth Context values
  return useContext(socketContext);
}