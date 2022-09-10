import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { CallsActionTypes } from "./types";
import { callsApiResponseSuccess, callsApiResponseError } from "./actions";

import {
  getCalls as getCallsApi,
  getUserInfo as getCallerInfoApi,
} from "../../api/index";

function* getCalls() {
  try {
    const response: Promise<any> = yield call(getCallsApi);
    yield put(callsApiResponseSuccess(CallsActionTypes.GET_CALLS, response));
  } catch (error: any) {
    yield put(callsApiResponseError(CallsActionTypes.GET_CALLS, error));
  }
}

function* getCallerInfo({ payload: data }: any) {
  try {
    const response: Promise<any> = yield call(getCallerInfoApi, data.userId);
    yield put(
      callsApiResponseSuccess(CallsActionTypes.GET_CALLER_INFO, response)
    );
  } catch (error: any) {
    yield put(callsApiResponseError(CallsActionTypes.GET_CALLER_INFO, error));
  }
}

export function* watchGetCalls() {
  yield takeEvery(CallsActionTypes.GET_CALLS, getCalls);
  yield takeEvery(CallsActionTypes.GET_CALLER_INFO, getCallerInfo);
}

function* callsSaga() {
  yield all([fork(watchGetCalls)]);
}

export default callsSaga;
