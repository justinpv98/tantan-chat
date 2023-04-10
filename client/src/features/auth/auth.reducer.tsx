import { Action } from "@/types/reducer";
import { AuthActionTypes } from "./auth.context";

type State = {
  id: string | number;
  email: string;
  username: string;
  avatar: string;
  status: string | number;
  message: string;
  loading: boolean;
};

export default (state: State, action: Action<AuthActionTypes>) => {
  switch (action.type) {
    case AuthActionTypes.REGISTER_SUCCESS:
    case AuthActionTypes.LOGIN_SUCCESS:
    case AuthActionTypes.CHECK_SESSION_SUCCESS:
    case AuthActionTypes.CHANGE_PROFILE_PICTURE_SUCCESS:
      return {
        ...state,
        message: "",
        loading: false,
        ...action.payload,
      };
    case AuthActionTypes.LOAD:
      return {
        ...state,
        loading: true,
      };
    case AuthActionTypes.REGISTER_FAIL:
    case AuthActionTypes.LOGIN_FAIL:
      return {
        ...state,
        id: "",
        username: "",
        email: "",
        profile_picture: "",
        status: "",
        message: action.payload,
      };
    case AuthActionTypes.LOGOUT:
    case AuthActionTypes.CHECK_SESSION_FAIL:
      return {
        ...state,
        id: "",
        username: "",
        email: "",
        profile_picture: "",
        status: "",
        message: "",
        loading: false,
      };
    case AuthActionTypes.CHANGE_PROFILE_PICTURE_FAIL:

    default:
      return state;
  }
};
