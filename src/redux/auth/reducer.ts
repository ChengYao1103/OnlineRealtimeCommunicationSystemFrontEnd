import { init_response, AuthActionTypes, AuthState } from "./types";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const INIT_STATE: AuthState = {
  error: "",
  loading: false,
  response: init_response,
  isUserLogin: undefined,
  isUserLogout: undefined,
  forgetSuccessMsg: "",
  forgetError: "",
  emailSended: undefined,
  passwordChanged: undefined,
  changepasswordSuccess: undefined,
  changepasswordError: undefined,
  registrationError: "",
  isUserRegistered: undefined,
  informationChanged: undefined,
  changeInfomationError: undefined,
};

const Auth = persistReducer(
  {
    storage,
    key: "orcsAuth",
    whitelist: ["response"],
  }, //把LoginState的response資料存到localStorage永久保存
  (state: AuthState = INIT_STATE, action: any) => {
    switch (action.type) {
      case AuthActionTypes.API_RESPONSE_SUCCESS:
        switch (action.payload.actionType) {
          case AuthActionTypes.LOGIN_USER:
            state.response = action.payload.data;
            state.loading = false;
            state.isUserLogin = true;
            state.isUserLogout = false;
            return { ...state };
          case AuthActionTypes.LOGOUT_USER:
            state.response = init_response;
            state.loading = false;
            state.isUserLogin = false;
            state.isUserLogout = true;
            return { ...state };
          case AuthActionTypes.FORGET_PASSWORD:
            state.loading = false;
            state.forgetSuccessMsg = action.payload.data;
            state.emailSended = true;
            return { ...state };
          case AuthActionTypes.CHANGE_PASSWORD:
            state.loading = false;
            state.changepasswordSuccess = action.payload.data;
            state.passwordChanged = true;
            return { ...state };
          case AuthActionTypes.REGISTER_USER:
            state.loading = false;
            state.registrationError = undefined;
            state.isUserRegistered = true;
            state.response = action.payload.data;
            return { ...state };
          case AuthActionTypes.USER_CHANGE_INFORMATION:
            state.loading = false;
            state.response = action.payload.data;
            state.changeInfomationError = undefined;
            state.informationChanged = true;
            return { ...state };
          default:
            return { ...state };
        }

      case AuthActionTypes.API_RESPONSE_ERROR:
        switch (action.payload.actionType) {
          case AuthActionTypes.LOGIN_USER:
            state.error = action.payload.error.data.message;
            state.loading = false;
            state.isUserLogin = false;
            return { ...state };
          case AuthActionTypes.LOGOUT_USER:
            state.loading = false;
            state.isUserLogin = false;
            state.isUserLogout = false;
            return { ...state };
          case AuthActionTypes.FORGET_PASSWORD:
            state.loading = false;
            state.forgetError = action.payload.error;
            state.emailSended = false;
            return { ...state };
          case AuthActionTypes.CHANGE_PASSWORD:
            state.loading = false;
            state.changepasswordError = action.payload.error.data.msg;
            state.passwordChanged = false;
            return { ...state };
          case AuthActionTypes.REGISTER_USER:
            state.loading = false;
            state.registrationError = action.payload.error.data.message;
            state.isUserRegistered = false;
            return { ...state };
          case AuthActionTypes.USER_CHANGE_INFORMATION:
            state.loading = false;
            state.changeInfomationError = action.payload.error.data.msg;
            state.informationChanged = false;
            return { ...state };
          default:
            return { ...state };
        }

      case AuthActionTypes.LOGIN_USER:
        state.loading = true;
        state.isUserLogin = false;
        return { ...state };

      case AuthActionTypes.LOGOUT_USER:
        state.loading = true;
        state.isUserLogout = false;
        return { ...state };

      case AuthActionTypes.FORGET_PASSWORD:
        state.loading = true;
        state.forgetSuccessMsg = undefined;
        state.forgetError = undefined;
        state.emailSended = false;
        return { ...state };

      case AuthActionTypes.CHANGE_PASSWORD:
        state.loading = true;
        state.passwordChanged = false;
        return { ...state };

      case AuthActionTypes.CLEAR_CHANGE_PASSWORD_STATE:
        state.loading = false;
        state.passwordChanged = false;
        state.changepasswordSuccess = undefined;
        state.changepasswordError = undefined;
        return { ...state };

      case AuthActionTypes.REGISTER_USER:
        state.loading = true;
        state.isUserRegistered = false;
        return { ...state };

      case AuthActionTypes.USER_CHANGE_INFORMATION:
        state.loading = true;
        state.changeInfomationError = undefined;
        state.informationChanged = false;
        return { ...state };

      default:
        return { ...state };
    }
  }
);

export default Auth;
