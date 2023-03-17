import { useContext } from "react";
import { ThemeContext } from "@/features/theme/theme.context";

export default function useTheme() {
  // returns Theme values
  return useContext(ThemeContext); 
}