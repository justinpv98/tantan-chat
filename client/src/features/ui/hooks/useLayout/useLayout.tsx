import { useContext } from "react";
import { LayoutContext } from "../../Layout/layout.context";

export default function useLayout() {
  // returns Auth Context values
  return useContext(LayoutContext);
}