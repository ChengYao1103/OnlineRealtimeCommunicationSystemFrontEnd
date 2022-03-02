import { AuthLoginActionTypes, AuthLoginState } from "./types";

export const INIT_STATE: AuthLoginState = {
  error: "",
  loading: false,
  response: {
    error: "",
    token: "",
    user: { email: "", id: 0, name: "", role: 0 },
  },
};

const Login = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case AuthLoginActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case AuthLoginActionTypes.LOGIN_USER:
          return {
            ...state,
            response: action.payload.data,
            loading: false,
            isUserLogin: true,
            isUserLogout: false,
          };
        case AuthLoginActionTypes.LOGOUT_USER:
          return {
            ...state,
            loading: false,
            isUserLogout: true,
          };
        default:
          return { ...state };
      }

    case AuthLoginActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case AuthLoginActionTypes.LOGIN_USER:
          return {
            ...state,
            error: action.payload.error.data.message,
            isUserLogin: false,
            loading: false,
          };
        case AuthLoginActionTypes.LOGOUT_USER:
          return {
            ...state,
            loading: false,
            isUserLogin: false,
            isUserLogout: false,
          };
        default:
          return { ...state };
      }

    case AuthLoginActionTypes.LOGIN_USER: {
      return {
        ...state,
        loading: true,
        isUserLogin: false,
      };
    }

    case AuthLoginActionTypes.LOGOUT_USER:
      return {
        ...state,
        loading: false,
        isUserLogout: false,
      };
    default:
      return { ...state };
  }
};

export default Login;
