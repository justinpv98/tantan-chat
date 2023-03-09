import React, { useState, createContext, useLayoutEffect } from "react";

interface ProviderProps {
  children?: React.ReactNode;
}

type Theme = {
    theme?: string;
    setTheme?: Function;
}

function getThemePreference(){
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
   return "dark"
  } else {
    return "light"
  }
}

const preferredTheme = getThemePreference();

export const ThemeContext = createContext<Theme>({});

export const ThemeProvider = ({ children }: ProviderProps) => {
  const [theme, setTheme] = useState<string>(preferredTheme);


  return (
    <ThemeContext.Provider value={{theme, setTheme}}>{children}</ThemeContext.Provider>
  );
};
