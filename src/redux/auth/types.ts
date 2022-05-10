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
}

interface AuthLoginResponse {
  error: string;
  token: string;
  user: userModel;
}

export interface getUserIdResponse {
  data: any;
  status: number;
}

export interface userModel {
  email: string;
  id: number;
  name: string;
  role: number;
  cover: string;
  photo: string;
}

const init_user = { email: "", id: 0, name: "", role: 0, cover: "", photo: "" };
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
  otherUserInfo?: userModel;
  getInfoError?: string;
}
