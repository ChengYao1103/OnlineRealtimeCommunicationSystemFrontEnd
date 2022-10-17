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
  MeetingCreated,
  AppUpdated,
  AppEvent,
  AppCreated,
  AppFinished,
  OpenedApps,
  PostCreated,
  NewCommentOnPost,
  NewFileFromUser,
} from "../repository/wsEvent";
import {
  channelModel,
  ChatsActionTypes,
  MessageTypeEnum,
} from "../redux/chats/types";
import { CallsActionTypes } from "../redux/calls/types";
import { ErrorMessages, ErrorMessagesKey } from "../repository/Enum";

// actions
import {
  callWebsocketEvent,
  chatWebsocketEvent,
  clearOtherUserInformation,
  getCallerInfo,
  getChannels,
  getPostComments,
  getRecentChat,
  getUserInformation,
} from "../redux/actions";
import { userModel } from "../redux/auth/types";
import { WSApp, YoutubeSync, YTEvent } from "../repository/wsAppEvent";
import { LOGOUT_URL } from "./apiCore";

const WSEventHandler = () => {
  const dispatch = useDispatch();
  const { useAppSelector } = useRedux();

  const { SenderUser, channels, recentChatUsers } = useAppSelector(state => ({
    SenderUser: state.Auth.otherUserInfo,
    channels: state.Chats.channels as channelModel[],
    recentChatUsers: state.Chats.recentChatUsers as userModel[],
  }));
  const [newContentInfo, setNewContentInfo] = useState<messageNotification>();
  const [invitedID, setInvitedID] = useState(-1);
  const { userProfile } = useProfile();

  /** 新訊息的提醒 */
  useEffect(() => {
    if (newContentInfo && SenderUser && SenderUser.id === newContentInfo.from) {
      switch (newContentInfo.type) {
        case MessageTypeEnum.text: {
          showInfoNotification(
            <span>
              {SenderUser.name} 傳送了一則訊息:
              <br />
              {newContentInfo.content}
            </span>
          );
          break;
        }
        case MessageTypeEnum.image: {
          showInfoNotification(`${SenderUser.name} 傳送了一張圖片`);
          break;
        }
        case MessageTypeEnum.file: {
          showInfoNotification(`${SenderUser.name} 傳送了一個檔案`);
          break;
        }
      }

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
        if (contentInfo.from !== userProfile.id) {
          dispatch(getUserInformation(contentInfo.from.toString()));
          setNewContentInfo({
            from: contentInfo.from,
            type: contentInfo.type,
            content:
              contentInfo.type === MessageTypeEnum.text
                ? contentInfo.content
                : "",
          });
        }
        if (
          !recentChatUsers ||
          (recentChatUsers &&
            recentChatUsers.findIndex(user => user.id === contentInfo.from) ===
              -1)
        ) {
          dispatch(getRecentChat(10, 1));
        }
        dispatch(
          chatWebsocketEvent(ChatsActionTypes.RECEIVE_MESSAGE, {
            ID: contentInfo.id,
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
        let fileInfo = data.data as NewFileFromUser;
        if (fileInfo.from !== userProfile.id) {
          dispatch(getUserInformation(fileInfo.from.toString()));
          setNewContentInfo({
            from: fileInfo.from,
            type: fileInfo.type,
            content: fileInfo.filename,
          });
        }
        if (
          !recentChatUsers ||
          (recentChatUsers &&
            recentChatUsers.findIndex(user => user.id === fileInfo.from) === -1)
        ) {
          dispatch(getRecentChat(10, 1));
        }
        dispatch(
          chatWebsocketEvent(ChatsActionTypes.RECEIVE_MESSAGE, {
            ID: fileInfo.messageID,
            SenderID: fileInfo.from,
            ReceiverID: fileInfo.to,
            Content: fileInfo.filename,
            Time: fileInfo.time,
            Type: fileInfo.type,
          })
        );
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
        let postInfo = data.data as PostCreated;
        dispatch(chatWebsocketEvent(ChatsActionTypes.NEW_POST, postInfo));
        break;
      case WSReceiveEvents.NewCommentOnPost:
        let commentInfo = data.data as NewCommentOnPost;
        dispatch(getPostComments(commentInfo.postID));
        // dispatch(chatWebsocketEvent(ChatsActionTypes.NEW_COMMENT, commentInfo));
        break;
      case WSReceiveEvents.RollCallCreated:
        break;
      // Meeting
      case WSReceiveEvents.UserJoinMeeting:
        dispatch(callWebsocketEvent(CallsActionTypes.USER_JOIN_ROOM));
        break;
      case WSReceiveEvents.MeetingCreateBySelf:
        let meetingData = data.data as MeetingCreated;
        dispatch(
          callWebsocketEvent(
            CallsActionTypes.GET_MEETING_CREATE_BY_SELF,
            meetingData.meetingID
          )
        );
        break;
      case WSReceiveEvents.OpenedApps:
        let openedApps = data.data as OpenedApps;
        dispatch(
          callWebsocketEvent(
            CallsActionTypes.GET_MEETING_OPENED_APPS,
            openedApps.appIDs
          )
        );
        break;
      // App
      case WSReceiveEvents.AppCreated:
        let creatededData = data.data as AppCreated;
        // 分辨app
        switch (creatededData.appID) {
          case WSApp.YouTubeSync: {
            dispatch(callWebsocketEvent(CallsActionTypes.START_YOUTUBE));
            break;
          }
          default: {
            break;
          }
        }
        break;
      case WSReceiveEvents.AppUpdated: {
        let updatedData = data.data as AppUpdated;
        // 分辨app
        switch (updatedData.appID) {
          case WSApp.YouTubeSync: {
            let ytData = updatedData.event as AppEvent;
            // 分辨Youtube app的event
            switch (ytData.event) {
              case YTEvent.sync: {
                let syncData = ytData.data as YoutubeSync;
                dispatch(
                  callWebsocketEvent(CallsActionTypes.YOUTUBE_SYNC, syncData)
                );
                break;
              }
              default: {
                break;
              }
            }
            break;
          }
          default: {
            break;
          }
        }
        break;
      }
      case WSReceiveEvents.AppFinished: {
        let endedData = data.data as AppFinished;
        // 分辨app
        switch (endedData.appID) {
          case WSApp.YouTubeSync: {
            dispatch(callWebsocketEvent(CallsActionTypes.END_YOUTUBE));
            break;
          }
          default: {
            break;
          }
        }
        break;
      }
      // WS service
      case WSReceiveEvents.Error:
        let ErrorData = data.data as WSReceiveError;
        showErrorNotification(
          ErrorMessages[ErrorData.error as ErrorMessagesKey]
        );
        break;
      case WSReceiveEvents.TokenExpired: // rarely triggered
        // timeout wont trigger this event
        console.log("token expired");
        window.location.href = LOGOUT_URL;
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

interface messageNotification {
  from: number;
  type: MessageTypeEnum;
  content: string;
}
