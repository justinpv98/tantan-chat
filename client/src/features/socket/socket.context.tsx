import React, { useRef, createContext } from "react";
import { io, Socket} from "socket.io-client";

interface ProviderProps {
  children?: React.ReactNode;
}

export const initialState = io(import.meta.env.VITE_SERVER_URL, {withCredentials: true});

export const SocketContext = createContext<Socket>(initialState);

export const SocketProvider = ({ children }: ProviderProps) => {
  const socketRef = useRef(initialState);

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>
};
