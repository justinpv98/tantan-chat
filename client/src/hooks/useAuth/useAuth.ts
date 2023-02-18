import { useContext } from "react";
import { AuthContext } from "@/features/auth/auth.context";

export default function useAuth() {
  // returns Auth Context values
  return useContext(AuthContext);
}