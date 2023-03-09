import React, { useState, createContext } from "react";
import { io, Socket} from "socket.io-client";

interface ProviderProps {
  children?: React.ReactNode;
}

export const initialState = io(import.meta.env.VITE_SERVER_URL, {withCredentials: true});

export const socketContext = createContext<Socket>(initialState);

export const SocketProvider = ({ children }: ProviderProps) => {
  const [socket, setSocket] = useState<Socket>(initialState)

  return <socketContext.Provider value={socket}>{children}</socketContext.Provider>
};