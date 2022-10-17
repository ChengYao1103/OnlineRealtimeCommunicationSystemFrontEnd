import { all } from "redux-saga/effects";

//auth
import AuthSaga from "./auth/saga";
import profileSaga from "./profile/saga";
import LayoutSaga from "./layout/saga";
import contactsSaga from "./contacts/saga";
import callsSaga from "./calls/saga";
import bookmarksSaga from "./bookmarks/saga";
import settingsSaga from "./settings/saga";
import chatsSaga from "./chats/saga";

export default function* rootSaga() {
  yield all([
    AuthSaga(),
    profileSaga(),
    LayoutSaga(),
    contactsSaga(),
    callsSaga(),
    bookmarksSaga(),
    settingsSaga(),
    chatsSaga(),
  ]);
}
