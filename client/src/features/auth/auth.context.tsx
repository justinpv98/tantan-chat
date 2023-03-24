import { createContext, useReducer } from "react";
import authReducer from "./auth.reducer";
import axios from "@/config/axios";

import { useSocket } from "@/hooks";

const BASE_URL = "/auth";

interface ProviderProps {
  children: React.ReactNode;
}

export interface AuthState {
    id: string;
    email: string;
    username: string;
    avatar: string;
    status: 1 | 2 | 3 | 4;
    message: string;
    loading: boolean;
    login: (data: LoginData) => void;
    register: (data: RegisterData) => void;
    logout: () => void;
    load: () => void;
    checkSession: () => void;
  }

  export enum AuthActionTypes {
    REGISTER_SUCCESS,
    LOGIN_SUCCESS,
    CHECK_SESSION_SUCCESS,
    REGISTER_FAIL,
    LOGIN_FAIL,
    CHECK_SESSION_FAIL,
    LOGOUT,
    LOAD
  }

  export type RegisterData = {
    email: string;
    username: string;
    password: string;
  };
  
  export type LoginData = {
    email: string;
    password: string;
  };

const initialState: AuthState = {
  id: "",
  email: "",
  username: "",
  avatar: "",
  status: 2,
  message: "",
  loading: false,
  login: () => {},
  register: () => {},
  logout: () => {},
  load: () => {},
  checkSession: () => {}
};

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }: ProviderProps) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);
  const socket = useSocket();

  async function login(data: LoginData): Promise<void> {
    try {
      const res = await axios.post(BASE_URL + "/login", data);
      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: res.data,
      });
      socket.close();
      socket.open();
    } catch (error: any) {
      dispatch({
        type: AuthActionTypes.LOGIN_FAIL,
        payload: error.response.data.message,
      });
    }
  }

  async function register(data: RegisterData): Promise<void> {
    try {
      const res = await axios.post(BASE_URL + "/register", data);
      dispatch({
        type: AuthActionTypes.REGISTER_SUCCESS,
        payload: res.data,
      });
    } catch (error: any) {
      dispatch({
        type: AuthActionTypes.REGISTER_FAIL,
        payload: error.response.data.message,
      });
    }
  }

  async function logout(): Promise<void> {
    try {
      const res = await axios.post(BASE_URL + "/logout");
      dispatch({
        type: AuthActionTypes.LOGOUT,
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function checkSession(): Promise<void> {
    load();
    try {
      const res = await axios.get(BASE_URL + "/check-session")
      dispatch({
        type: AuthActionTypes.CHECK_SESSION_SUCCESS,
        payload: res.data
      })
    } catch (error: any) {
      dispatch({
        type: AuthActionTypes.CHECK_SESSION_FAIL,
        payload: null
      })
    }
  }

  function load(): void {
    dispatch({
      type: AuthActionTypes.LOAD,
      payload: null
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        checkSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
