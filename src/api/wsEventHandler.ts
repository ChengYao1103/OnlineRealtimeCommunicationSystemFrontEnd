import { NewContent, WSEvent, WSReceiveEvents } from "../repository/wsEvent";
import { ChatsActionTypes } from "../redux/chats/types";
import { chatWebsocketEvent } from "../redux/chats/actions";
import { store } from "../redux/store";

export function WSEventHandler(data: WSEvent, selfid: number) {
  switch(data.event) {
    case WSReceiveEvents.NewContent:
      let contentInfo = data.data as NewContent;
      /*if (store) {
        store.dispatch(chatWebsocketEvent(ChatsActionTypes.RECEIVE_MESSAGE, {
          SenderID: contentInfo.from,
          ReceiverID: contentInfo.to,
          Content: contentInfo.content,
          Type: contentInfo.type,
          Time: contentInfo.time,
        }));
      }*/
      break;
    case WSReceiveEvents.ContentBeenRead:
      break;
    case WSReceiveEvents.TokenExpired:
      TokenExpiredHandler();
      break;
  }
}

function TokenExpiredHandler() {
  window.location.href = './logout';
}

/*
export function* watchNewContentHandler() {
  yield takeEvery(ChatsActionTypes.RECEIVE_MESSAGE ,NewContentHandler);
}

function* wsEventSaga() {
  yield all([
    fork(watchNewContentHandler),
  ]);
}

export default wsEventSaga;*/