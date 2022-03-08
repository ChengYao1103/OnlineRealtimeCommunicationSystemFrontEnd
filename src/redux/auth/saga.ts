import {
  call,
  put,
  takeEvery,
  takeLatest,
  all,
  fork,
} from "redux-saga/effects";

// Auth Redux States
import { AuthActionTypes } from "./types";
import { authApiResponseSuccess, authApiResponseError } from "./actions";

//Include Both Helper File with needed methods
import {
  getFirebaseBackend,
  setLoggeedInUser,
} from "../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
  postJwtForgetPwd,
  changePassword as changePasswordApi,
  postJwtRegister,
} from "../../api/index";

const fireBaseBackend = getFirebaseBackend();
/*          Login         */
function* loginUser({ payload: { user } }: any) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response: Promise<any> = yield call(
        fireBaseBackend.loginUser,
        user.email,
        user.password
      );
      // myData
      yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, response));
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      const response: Promise<any> = yield call(postJwtLogin, {
        email: user.email,
        password: user.password,
      });
      setLoggeedInUser(response);
      yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, response));
    } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
      const response: Promise<any> = yield call(postFakeLogin, {
        email: user.email,
        password: user.password,
      });
      setLoggeedInUser(response);
      yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, response));
    }
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, error));
  }
}

function* socialLogin({ payload: { data, type } }: any) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      let fireBaseBackend = getFirebaseBackend();
      const response: Promise<any> = yield call(
        fireBaseBackend.socialLoginUser,
        data,
        type
      );
      setLoggeedInUser(response);
      yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, response));
    } else {
      const response: Promise<any> = yield call(postSocialLogin, data);
      yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, response));
    }
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, error));
  }
}

function* logoutUser() {
  try {
    localStorage.removeItem("authUser");
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response: Promise<any> = yield call(fireBaseBackend.logout);
      yield put(authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, response));
    } else {
      yield put(authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, true));
    }
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.LOGOUT_USER, error));
  }
}

/*          Forget Password & Change password         */
//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* forgetUser({ payload: user }: any) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      yield call(postJwtForgetPwd, {
        email: user.email,
      });
      yield put(
        authApiResponseSuccess(
          AuthActionTypes.FORGET_PASSWORD,
          "Reset link are sended to your mailbox, check there first"
        )
      );
    }
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.FORGET_PASSWORD, error));
  }
}

/*          Register          */
function* registerUser({ payload: { user } }: any) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      const response: Promise<any> = yield call(postJwtRegister, user);
      yield put(
        authApiResponseSuccess(AuthActionTypes.REGISTER_USER, response)
      );
    }
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.REGISTER_USER, error));
  }
}

function* changePassword({ payload: { data } }: any) {
  try {
    yield call(changePasswordApi, {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
    yield put(
      authApiResponseSuccess(
        AuthActionTypes.CHANGE_PASSWORD,
        "Your Password is Changed, will go back in 0.5 sec"
      )
    );
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.CHANGE_PASSWORD, error));
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(AuthActionTypes.FORGET_PASSWORD, forgetUser);
}

export function* watchUserChangePassword() {
  yield takeEvery(AuthActionTypes.CHANGE_PASSWORD, changePassword);
}

export function* watchUserRegister() {
  yield takeEvery(AuthActionTypes.REGISTER_USER, registerUser);
}

function* AuthSaga() {
  yield takeEvery(AuthActionTypes.LOGIN_USER, loginUser);
  yield takeEvery(AuthActionTypes.LOGOUT_USER, logoutUser);
  yield takeLatest(AuthActionTypes.SOCIAL_LOGIN, socialLogin);

  yield all([fork(watchUserRegister)]);
  yield all([fork(watchUserPasswordForget), fork(watchUserChangePassword)]);
}

export default AuthSaga;
