import { StringLiteral } from "typescript";
import { RoleTypes } from "./Enum";
import { WSApp, YTEvent } from "./wsAppEvent";

/*    App    */
export interface AppEvent {
  event: number;
  data: AppData;
}

export interface AppData {}

/*    WebSocket    */
export interface WSEvent {
  event: WSSendEvents | WSReceiveEvents;
  data: WSData;
}

export interface WSData {}

export enum WSSendEvents {
  SendContent = 11,
  ReadContent = 12,
  SendFileToUser = 13,
  MakePhoneCall = 21,
  ResponsePhoneCall = 22,
  SendSignalingInformation = 23,
  EndPhoneCall = 24,
  InviteUserIntoChannel = 31,
  KickUserOutChannel = 32,
  MakeNewPost = 33,
  CommentOnPost = 34,
  CreateRollCall = 35,
  UpdatePost = 36,
  CreateMeeting = 41,
  JoinMeeting = 42,
  LeaveMeeting = 43,
  CreateApp = 51,
  UpdateApp = 52,
  FinishApp = 53,
  UpdateToken = 90,
}

export enum WSReceiveEvents {
  NewContent = 11,
  ContentBeenRead = 12,
  NewFileFromUser = 13,
  AskPhoneCall = 21,
  AnswerPhoneCall = 22,
  GetSignalingInformation = 23,
  HangUpPhoneCall = 24,
  BeenInvitedIntoChannel = 31,
  BeenKickedOutChannel = 32,
  PostCreated = 33,
  NewCommentOnPost = 34,
  RollCallCreated = 35,
  PostUpdated = 36,
  MeetingCreated = 41,
  UserJoinMeeting = 42,
  UserLeaveMeeting = 43,
  MeetingCreateBySelf = 44,
  OpenedApps = 45,
  AppCreated = 51,
  AppUpdated = 52,
  AppFinished = 53,
  Error = 90,
  TokenExpired = 91,
}

//
// send
//
export interface SendContentToUser extends WSData {
  to: number;
  type: number;
  content: string;
}

export interface ReadUserContent extends WSData {
  user: number;
  contentId: number;
}

export interface SendFileToUser extends WSData {
  to: number;
  messageID: number;
}

export interface MakePhoneCall extends WSData {
  to: number;
}

export interface ResponsePhoneCall extends WSData {
  from: number;
  accept: boolean;
}

export interface SendSignalingInformation extends WSData {
  to: number;
  info: string;
  type: string;
}

export interface EndPhoneCall extends WSData {
  to: number;
}

export interface InviteUserIntoChannel extends WSData {
  channelID: number;
  emailArray: string[];
  roleArray: RoleTypes[];
}

export interface KickUserOutChannel extends WSData {
  channelID: number;
  userID: number;
}

export interface MakeNewPost extends WSData {
  channelID: number;
  content: string;
}

export interface CommentOnPost extends WSData {
  postID: number;
  content: string;
}

export interface CreateRollCall extends WSData {
  channelID: number;
  startTime: string;
  endTime: string;
}

export interface UpdatePost extends WSData {
  postID: number;
  content: string;
}

export interface CreateMeeting extends WSData {
  channelID: number;
  name: string;
}

export interface JoinMeeting extends WSData {
  meetingID: number;
}

export interface CreateApp extends WSData {
  appID: number;
}

export interface FinishApp extends WSData {
  appID: number;
}

export interface UpdateToken extends WSData {
  newToken: string;
}

//
// receive
//
export interface NewContent extends WSData {
  from: number;
  to: number;
  type: number;
  content: string;
  id: number;
  time: string;
}

export interface ContentBeenRead extends WSData {
  user: number;
  contentId: number;
}

export interface NewFileFromUser extends WSData {
  from: number;
  to: number;
  filename: string;
  type: number;
  time: string;
}

export interface AskPhoneCall extends WSData {
  from: number;
}

export interface AnswerPhoneCall extends WSData {
  from: number;
  accept: boolean;
}

export interface GetSignalingInformation extends WSData {
  from: number;
  info: any;
  type: string;
}

export interface HangUpPhoneCall extends WSData {
  from: number;
}

export interface BeenInvitedIntoChannel extends WSData {
  channelID: number;
  role: RoleTypes;
}

export interface BeenKickedOutChannel extends WSData {
  channelID: number;
}

export interface PostCreated extends WSData {
  channelID: number;
  content: string;
  createUser: number;
  createTime: string;
  meetingID: number;
  postID: string;
}

export interface NewCommentOnPost extends WSData {
  channelID: number;
  postID: number;
  content: string;
  createUser: number;
  createTime: string;
}

export interface RollCallCreated extends WSData {
  channelID: number;
  rollCallID: number;
  createTime: string;
  startTime: string;
  endTime: string;
}

export interface PostUpdated extends WSData {
  postID: number;
  channelID: number;
  content: string;
}

export interface MeetingCreated extends WSData {
  meetingID: number;
  chairpersonID: number;
  channelID: number;
  postID: number;
  name: string;
  startTime: string;
}

export interface UserJoinMeeting extends WSData {
  meetingID: number;
  userID: number;
}

export interface UserLeaveMeeting extends WSData {
  meetingID: number;
  userID: number;
}

export interface OpenedApps extends WSData {
  appIDs: WSApp[];
}

export interface AppCreated extends WSData {
  appID: number;
}

export interface AppUpdated extends WSData {
  appID: WSApp;
  event: AppEvent;
}

export interface AppFinished extends WSData {
  appID: number;
}

export interface WSReceiveError extends WSData {
  error: string;
}
