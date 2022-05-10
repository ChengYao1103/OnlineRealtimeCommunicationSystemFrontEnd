import { getUserIdResponse } from "../redux/auth/types";
import { APIClient } from "./apiCore";
import * as url from "./urls";

const api = new APIClient();

/* fake method */
const postFakeLogin = (data: any) => {
  return api.create(url.POST_FAKE_LOGIN, data);
};

// Register Method
const postFakeRegister = (data: any) => {
  return api.create(url.POST_FAKE_REGISTER, data);
};

// postForgetPwd
const postFakeForgetPwd = (data: any) => {
  return api.create(url.POST_FAKE_PASSWORD_FORGET, data);
};

/* JWT method */
const postJwtLogin = (data: any) => {
  return api.create(url.POST_JWT_LOGIN, data);
};

// Register Method
const postJwtRegister = (data: any) => {
  return api.create(url.JWT_REGISTER, data);
};

// postForgetPwd
const postJwtForgetPwd = (data: any) => {
  return api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);
};

const changePassword = (data: object) => {
  return api.patch(url.USER_CHANGE_PASSWORD, data);
};

// Change Information
const changeInformation = (data: object) => {
  return api.patch(url.USER_CHANGE_INFOMATION, data);
};

// postSocialLogin
const postSocialLogin = (data: any) => {
  return api.create(url.SOCIAL_LOGIN, data);
};

// get auth user's information
const getAuthInfo = () => {
  return api.get(url.GET_AUTH_INFOMATION);
};

// get other user's information
const getUserInfo = (userId: string) => {
  let destUrl = `/user/${userId}`;
  return api.get(destUrl);
};

// get user id by email
async function getUserIdByEmail(email: string): Promise<getUserIdResponse> {
  // 不經過redux，直接透過api回傳id，但不以object包住直接傳值的話無法執行
  // 因此以加在網址後面的方式傳入值
  try {
    /*const { data, status } = await api.get(
      `${url.GET_USERID_BY_EMAIL}?email=${email}`
    );*/
    const { data, status } = await api.get(url.GET_USERID_BY_EMAIL, {
      email: email,
    });
    return { data, status };
  } catch (err: any) {
    const { data, status } = err;
    return { data, status };
  }
}

export {
  postFakeForgetPwd,
  postJwtForgetPwd,
  postFakeLogin,
  postJwtLogin,
  postFakeRegister,
  postJwtRegister,
  changePassword,
  postSocialLogin,
  changeInformation,
  getAuthInfo,
  getUserInfo,
  getUserIdByEmail,
};
