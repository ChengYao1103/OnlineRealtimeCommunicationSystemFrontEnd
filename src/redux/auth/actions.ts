import { AuthActionTypes } from "./types";

// common success
export const authApiResponseSuccess = (actionType: string, data: any) => ({
  type: AuthActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

// common error
export const authApiResponseError = (actionType: string, error: string) => ({
  type: AuthActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// Login & Logout
export const loginUser = (user: any) => {
  return {
    type: AuthActionTypes.LOGIN_USER,
    payload: { user },
  };
};

export const logoutUser = () => {
  return {
    type: AuthActionTypes.LOGOUT_USER,
  };
};

export const socialLogin = (data: any, type: "facebook" | "google") => {
  return {
    type: AuthActionTypes.SOCIAL_LOGIN,
    payload: { data, type },
  };
};

// Forget password & Change password
export const userForgetPassword = (user: any) => {
  return {
    type: AuthActionTypes.FORGET_PASSWORD,
    payload: user,
  };
};

export const userChangePassword = (data: any) => {
  return {
    type: AuthActionTypes.CHANGE_PASSWORD,
    payload: { data },
  };
};

export const clearChangePasswordState = () => {
  return { type: AuthActionTypes.CLEAR_CHANGE_PASSWORD_STATE };
};

// Register
export const registerUser = (user: any) => {
  return {
    type: AuthActionTypes.REGISTER_USER,
    payload: { user },
  };
};

// Change information
export const userChangeInformation = (data: any) => {
  return {
    type: AuthActionTypes.USER_CHANGE_INFORMATION,
    payload: { data },
  };
};

// Get auth user information
export const getAuthInformation = () => {
  return {
    type: AuthActionTypes.GET_AUTH_INFOMATION,
    payload: {},
  };
};

// Get user information
export const getUserInformation = (userId: string) => {
  return {
    type: AuthActionTypes.GET_USER_INFOMATION,
    payload: { userId },
  };
};

// clear other user info state
export const clearOtherUserInformation = () => {
  return {
    type: AuthActionTypes.CLEAR_OTHER_USER_INFOMATION,
    payload: {},
  };
};

// get user id by email
export const getUserId = (Email: string) => {
  return {
    type: AuthActionTypes.GET_USER_ID_BY_EMAIL,
    payload: { Email },
  };
};
// clear other user id state
export const clearOtherUserId = () => {
  return {
    type: AuthActionTypes.CLEAR_OTHER_USER_ID,
    payload: {},
  };
};
