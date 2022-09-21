import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { WSConnection } from "./webSocket";
import { useProfile, useRedux } from "../hooks";
import {
  showErrorNotification,
  showInfoNotification,
} from "../helpers/notifications";

// interfaces
import {
  GetSignalingInformation,
  NewContent,
  BeenInvitedIntoChannel,
  WSEvent,
  WSReceiveEvents,
  WSReceiveError,
} from "../repository/wsEvent";
import { channelModel, ChatsActionTypes } from "../redux/chats/types";
import { CallsActionTypes } from "../redux/calls/types";

// actions
import {
  callWebsocketEvent,
  chatWebsocketEvent,
  clearOtherUserInformation,
  getCallerInfo,
  getChannels,
  getUserInformation,
} from "../redux/actions";

const WSEventHandler = () => {
  const dispatch = useDispatch();
  const { useAppSelector } = useRedux();

  const { SenderUser, channels } = useAppSelector(state => ({
    SenderUser: state.Auth.otherUserInfo,
    channels: state.Chats.channels as channelModel[],
  }));
  const [newContentInfo, setNewContentInfo] = useState<NewContent>();
  const [invitedID, setInvitedID] = useState(-1);
  const { userProfile } = useProfile();

  /** 新訊息的提醒 */
  useEffect(() => {
    if (newContentInfo && SenderUser && SenderUser.id === newContentInfo.from) {
      showInfoNotification(
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

  /** 邀請群組的提醒 */
  useEffect(() => {
    if (invitedID === -1) {
      return;
    }
    if (channels && channels.length > 0) {
      channels.forEach(channel => {
        if (channel.id === invitedID) {
          showInfoNotification(
            <span>
              您已被邀請加入群組:
              <br />
              {channel.name}
            </span>
          );
          setInvitedID(-1);
        }
      });
    }
  }, [invitedID, channels]);

  WSConnection.onMessageEvent = (event: any) => {
    let data: WSEvent = JSON.parse(event.data);
    console.log(data, data.event);
    switch (data.event) {
      // Message
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
      case WSReceiveEvents.NewFileFromUser:
        break;
      // Calls
      case WSReceiveEvents.AskPhoneCall:
        break;
      case WSReceiveEvents.AnswerPhoneCall:
        dispatch(callWebsocketEvent(CallsActionTypes.ANSWERED_CALLING));
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
      // Channel
      case WSReceiveEvents.BeenInvitedIntoChannel:
        dispatch(getChannels(userProfile.id.toString()));
        let invitedData = data.data as BeenInvitedIntoChannel;
        setInvitedID(invitedData.channelID);
        break;
      case WSReceiveEvents.BeenKickedOutChannel:
        break;
      case WSReceiveEvents.PostCreated:
        break;
      case WSReceiveEvents.NewCommentOnPost:
        break;
      case WSReceiveEvents.RollCallCreated:
        break;
      case WSReceiveEvents.Error:
        let ErrorData = data.data as WSReceiveError;
        showErrorNotification(ErrorData.error);
        break;
      // WS service
      case WSReceiveEvents.TokenExpired: // rarely triggered
        // timeout wont trigger this event
        console.log("token expired");
        break;
      default:
        console.log("unknown ws event");
        break;
    }
  };

  WSConnection.onErrorEvent = (event: any) => {
    console.log(event);
  };

  return <></>;
};

export default WSEventHandler;
