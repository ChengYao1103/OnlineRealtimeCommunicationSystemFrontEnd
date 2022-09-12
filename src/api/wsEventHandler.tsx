import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { WSConnection } from "./webSocket";
import { useProfile, useRedux } from "../hooks";
import {
  callWebsocketEvent,
  chatWebsocketEvent,
  clearOtherUserInformation,
  getCallerInfo,
  getUserInformation,
} from "../redux/actions";
import { ChatsActionTypes } from "../redux/chats/types";
import { CallsActionTypes } from "../redux/calls/types";
import {
  GetSignalingInformation,
  NewContent,
  WSEvent,
  WSReceiveEvents,
} from "../repository/wsEvent";
import { useEffect, useState } from "react";

const WSEventHandler = () => {
  const dispatch = useDispatch();
  const { useAppSelector } = useRedux();

  const { SenderUser } = useAppSelector(state => ({
    SenderUser: state.Auth.otherUserInfo,
  }));
  const [newContentInfo, setNewContentInfo] = useState<NewContent>();
  const { userProfile } = useProfile();

  useEffect(() => {
    if (newContentInfo && SenderUser && SenderUser.id === newContentInfo.from) {
      toast.info(
        <span>
          {SenderUser.name} 傳送了一則訊息:
          <br />
          {newContentInfo.content}
        </span>
      );
      dispatch(clearOtherUserInformation());
      setNewContentInfo({} as NewContent);
    }
  }, [newContentInfo, SenderUser]);

  WSConnection.onMessageEvent = (event: any) => {
    let data: WSEvent = JSON.parse(event.data);
    console.log(data.event);
    switch (data.event) {
      case WSReceiveEvents.NewContent:
        let contentInfo = data.data as NewContent;
        if (contentInfo.type === 0 && contentInfo.from !== userProfile.id) {
          dispatch(getUserInformation(contentInfo.from.toString()));
          setNewContentInfo(contentInfo);
        }
        dispatch(
          chatWebsocketEvent(ChatsActionTypes.RECEIVE_MESSAGE, {
            SenderID: contentInfo.from,
            ReceiverID: contentInfo.to,
            Content: contentInfo.content,
            Time: contentInfo.time,
            Type: contentInfo.type,
          })
        );
        break;
      case WSReceiveEvents.ContentBeenRead:
        break;
      case WSReceiveEvents.AskPhoneCall:
        break;
      case WSReceiveEvents.AnswerPhoneCall:
        break;
      case WSReceiveEvents.GetSignalingInformation:
        let info = data.data as GetSignalingInformation;
        if (WSConnection.getSignalingEvent) {
          if (WSConnection.signalingInfoQueue.length !== 0) {
            WSConnection.signalingInfoQueue.push(info);
          } else {
            WSConnection.getSignalingEvent(info);
          }
        } else {
          WSConnection.signalingInfoQueue.push(info);
          dispatch(getCallerInfo(info.from.toString()));
          dispatch(callWebsocketEvent(CallsActionTypes.ON_CALLING, info.type));
        }
        break;
      case WSReceiveEvents.HangUpPhoneCall:
        dispatch(callWebsocketEvent(CallsActionTypes.HANGUP_CALLING));
        break;
      case WSReceiveEvents.TokenExpired:
        console.log("token expired");
        break;
      default:
        console.log("unknown ws event");
        break;
    }
  };

  return <></>;
};

export default WSEventHandler;
