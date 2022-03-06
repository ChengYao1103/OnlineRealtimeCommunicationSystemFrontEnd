import { AuthLoginActionTypes, AuthLoginState } from "./types";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { AuthLoginResponse } from "./types";

export const INIT_STATE: AuthLoginState = {
  error: "",
  loading: false,
  response: undefined,
  isUserLogin: undefined,
  isUserLogout: undefined,
};

const Login = persistReducer(
  {
    storage,
    key: "orcsAuth",
    whitelist: ["response"],
  }, //把LoginState的response資料存到localStorage永久保存
  (state: AuthLoginState = INIT_STATE, action: any) => {
    switch (action.type) {
      case AuthLoginActionTypes.API_RESPONSE_SUCCESS:
        switch (action.payload.actionType) {
          case AuthLoginActionTypes.LOGIN_USER:
            const response: AuthLoginResponse = action.payload.data;
            state.response = response;
            state.loading = false;
            state.isUserLogin = true;
            state.isUserLogout = false;
            return { ...state };
          case AuthLoginActionTypes.LOGOUT_USER:
            state.response = undefined;
            state.loading = false;
            state.isUserLogin = false;
            state.isUserLogout = true;
            return { ...state };
          default:
            return { ...state };
        }

      case AuthLoginActionTypes.API_RESPONSE_ERROR:
        switch (action.payload.actionType) {
          case AuthLoginActionTypes.LOGIN_USER:
            state.error = action.payload.error.data.message;
            state.loading = false;
            state.isUserLogin = false;
            return { ...state };
          case AuthLoginActionTypes.LOGOUT_USER:
            state.loading = false;
            state.isUserLogin = false;
            state.isUserLogout = false;
            return { ...state };
          default:
            return { ...state };
        }

      case AuthLoginActionTypes.LOGIN_USER: {
        state.loading = true;
        state.isUserLogin = false;
        return { ...state };
      }

      case AuthLoginActionTypes.LOGOUT_USER:
        state.loading = true;
        state.isUserLogout = false;
        return { ...state };
      default:
        return { ...state };
    }
  }
);

export default Login;
