import React, { useState, createContext } from "react";

interface Context {
  showChat: boolean;
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
}
interface ProviderProps {
  children?: React.ReactNode;
}

export const initialState: any = {
  showChat: false,
  setShowChat: () => {},
};

export const LayoutContext = createContext(initialState);

export const LayoutProvider = ({ children }: ProviderProps) => {
  const [showChat, setShowChat] = useState(false);

  return (
    <LayoutContext.Provider value={{ showChat, setShowChat }}>
      {children}
    </LayoutContext.Provider>
  );
};
