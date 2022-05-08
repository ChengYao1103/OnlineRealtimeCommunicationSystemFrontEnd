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

// get other user's information
const getUserInfo = (data: object) => {
  //let destUrl = `${url.GET_USER_INFOMATION}/${userId}`;
  return api.get(url.GET_USER_INFOMATION, data);
};

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
  getUserInfo,
};
