import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { WSConnection } from "./webSocket";
import { useProfile, useRedux } from "../hooks";
import {
  callWebsocketEvent,
  chatWebsocketEvent,
  clearOtherUserInformation,
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

const WSEventHandler = () => {
  const dispatch = useDispatch();
  const { useAppSelector } = useRedux();

  const { SenderUser } = useAppSelector(state => ({
    SenderUser: state.Auth.otherUserInfo,
  }));
  const { userProfile } = useProfile();

  WSConnection.onMessageEvent = (event: any) => {
    let data: WSEvent = JSON.parse(event.data);
    console.log(data.event);
    switch (data.event) {
      case WSReceiveEvents.NewContent:
        let contentInfo = data.data as NewContent;
        if (contentInfo.type === 0 && contentInfo.from !== userProfile.id) {
          dispatch(getUserInformation(contentInfo.from.toString()));
          toast.info(
            <span>
              {SenderUser.name} 傳送了一則訊息:
              <br />
              {contentInfo.content}
            </span>
          );
          dispatch(clearOtherUserInformation());
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
          WSConnection.getSignalingEvent(info);
        } else {
          dispatch(getUserInformation(info.from.toString()));
          dispatch(callWebsocketEvent(CallsActionTypes.ON_CALLING));
        }
        break;
      case WSReceiveEvents.HangUpPhoneCall:
        dispatch(callWebsocketEvent(CallsActionTypes.HANGUP_CALL));
        console.log("掛斷");
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
