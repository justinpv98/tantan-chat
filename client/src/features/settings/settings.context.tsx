import React, { useState, createContext } from "react";
import { useLocalStorage } from "@/hooks";

interface ProviderProps {
  children?: React.ReactNode;
}

type Settings = {
  muteNotifications?: boolean;
  setMuteNotifications?: Function;
};

export const SettingsContext = createContext<Settings>({});

export const SettingsProvider = ({ children }: ProviderProps) => {
  const [muteNotifications, setMuteNotifications] = useLocalStorage<boolean>(
    "muteNotifications",
    false
  );

  return (
    <SettingsContext.Provider
      value={{ muteNotifications, setMuteNotifications }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
