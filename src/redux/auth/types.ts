export enum AuthActionTypes {
  API_RESPONSE_SUCCESS = "@@auth/API_RESPONSE_SUCCESS",
  API_RESPONSE_ERROR = "@@auth/API_RESPONSE_ERROR",

  LOGIN_USER = "@@auth/LOGIN_USER",
  LOGOUT_USER = "@@auth/LOGOUT_USER",
  SOCIAL_LOGIN = "@@auth/SOCIAL_LOGIN",

  FORGET_PASSWORD = "@@auth/FORGET_PASSWORD",
  CHANGE_PASSWORD = "@@auth/CHANGE_PASSWORD",
  CLEAR_CHANGE_PASSWORD_STATE = "@@auth/CLEAR_CHANGE_PASSWORD_STATE",

  REGISTER_USER = "@@auth/REGISTER_USER",

  USER_CHANGE_INFORMATION = "@@auth/USER_CHANGE_INFORMATION",
  GET_AUTH_INFOMATION = "@@auth/GET_AUTH_INFOMATION",
  GET_USER_INFOMATION = "@@auth/GET_USER_INFOMATION",
  GET_USER_ID_BY_EMAIL = "@@auth/GET_USER_ID_BY_EMAIL",
  CLEAR_OTHER_USER_ID = "@@auth/CLEAR_OTHER_USER_ID",
}

interface AuthLoginResponse {
  error: string;
  token: string;
  user: userModel;
}

export interface userModel {
  email: string;
  id: number;
  name: string;
  cover: string;
  photo: string;
}

const init_user = { email: "", id: 0, name: "", cover: "", photo: "" };
export const init_response = { error: "", token: "", user: init_user };

export interface AuthState {
  error: string;
  loading: boolean;
  response: AuthLoginResponse;
  isUserLogin?: boolean;
  isUserLogout?: boolean;
  forgetSuccessMsg?: string;
  forgetError?: string;
  emailSended?: boolean;
  passwordChanged?: boolean;
  changepasswordSuccess?: string;
  changepasswordError?: string;
  registrationError?: string;
  isUserRegistered?: boolean;
  informationChanged?: boolean;
  changeInfomationError?: string;
  otherUserId?: number;
  otherUserInfo?: userModel;
  getInfoError?: string;
}
