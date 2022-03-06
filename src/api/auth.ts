import { APIClient } from "./apiCore";
import * as url from "./urls";

const api = new APIClient();

// postForgetPwd
const postFakeForgetPwd = (data: any) =>
  api.create(url.POST_FAKE_PASSWORD_FORGET, data);

// postForgetPwd
const postJwtForgetPwd = (data: any) =>
  api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

const postFakeLogin = (data: any) => api.create(url.POST_FAKE_LOGIN, data);

const postJwtLogin = (data: any) => api.create(url.POST_JWT_LOGIN, data);

// Register Method
const postFakeRegister = (data: any) => {
  return api.create(url.POST_FAKE_REGISTER, data);
};

// Register Method
const postJwtRegister = (data: any) => {
  return api.create(url.JWT_REGISTER, data);
};
const changePassword = (data: object) => {
  return api.patch(url.USER_CHANGE_PASSWORD, data);
};

// Change Information
const changeInformation = (data: object) => {
  return api.patch(url.USER_CHANGE_INFOMATION, data);
};

// postSocialLogin
const postSocialLogin = (data: any) => api.create(url.SOCIAL_LOGIN, data);

export {
  postFakeForgetPwd,
  postJwtForgetPwd,
  postFakeLogin,
  postJwtLogin,
  postFakeRegister,
  postJwtRegister,
  changePassword,
  postSocialLogin,
};
