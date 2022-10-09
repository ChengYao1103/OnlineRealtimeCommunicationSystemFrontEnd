import { userModel } from "../auth/types";

export enum ChatsActionTypes {
  API_RESPONSE_SUCCESS = "@@chats/API_RESPONSE_SUCCESS",
  API_RESPONSE_ERROR = "@@chats/API_RESPONSE_ERROR",

  WS_EVENT = "@@chats/WS_EVENT",

  GET_FAVOURITES = "@@chats/GET_FAVOURITES",
  GET_DIRECT_MESSAGES = "@@chats/GET_DIRECT_MESSAGES",
  GET_CHANNELS = "@@chats/GET_CHANNELS",
  GET_ROLE = "@@chats/GET_ROLE",
  GET_CHANNEL_MEMBERS = "@@chats/GET_CHANNEL_MEMBERS",
  INVITE_CHANNEL_MEMBERS = "@@chats/INVITE_CHANNEL_MEMBERS",
  GET_CHANNEL_POSTS = "@@chats/GET_CHANNEL_POSTS",
  KICK_OUT_MEMBER = "@@chats/KICK_OUT_MEMBER",

  ADD_CONTACTS = "@@chats/ADD_CONTACTS",
  CREATE_CHANNEL = "@@chats/CREATE_CHANNEL",
  CHANGE_SELECTED_CHAT = "@@chats/CHANGE_SELECTED_CHAT",
  GET_CHAT_USER_DETAILS = "@@chats/GET_CHAT_USER_DETAILS",
  GET_CHAT_USER_CONVERSATIONS = "@@chats/GET_CHAT_USER_CONVERSATIONS",
  GET_RECENT_CHAT = "@@chats/GET_RECENT_CHAT",
  TOGGLE_USER_DETAILS_TAB = "@@chats/TOGGLE_USER_DETAILS_TAB",

  // MESSAGE
  ON_SEND_MESSAGE = "@@chats/ON_SEND_MESSAGE",
  RECEIVE_MESSAGE = "@@chats/RECEIVE_MESSAGE",
  READ_MESSAGE = "@@chats/READ_MESSAGE",
  RECEIVE_MESSAGE_FROM_USER = "@@chats/RECEIVE_MESSAGE_FROM_USER",
  DELETE_MESSAGE = "@@chats/DELETE_MESSAGE",
  FORWARD_MESSAGE = "@@chats/FORWARD_MESSAGE",
  DELETE_USER_MESSAGES = "@@chats/DELETE_USER_MESSAGES",
  GET_CHANNEL_DETAILS = "@@chats/GET_CHANNEL_DETAILS",
  TOGGLE_FAVOURITE_CONTACT = "@@chats/TOGGLE_FAVOURITE_CONTACT",
  GET_ARCHIVE_CONTACT = "@@chats/GET_ARCHIVE_CONTACT",
  TOGGLE_ARCHIVE_CONTACT = "@@chats/TOGGLE_ARCHIVE_CONTACT",
  READ_CONVERSATION = "@@chats/READ_CONVERSATION",
  DELETE_IMAGE = "@@chats/DELETE_IMAGE",
  UPLOAD_MESSAGE_FILE = "@@chats/UPLOAD_MESSAGE_FILE",
  DOWNLOAD_MESSAGE_FILE = "@@chats/DOWNLOAD_MESSAGE_FILE",

  //POST
  CREATE_POST = "@@chats/CREATE_POST",
  CREATE_COMMENT = "@@chats/CREATE_COMMENT",
  DELETE_POST = "@@chats/DELETE_POST",
  DELETE_COMMENT = "@@chats/DELETE_COMMENT",
  GET_POST_COMMENTS = "@@chats/GET_POST_COMMENTS",

  //ROLLCALL
  CREATE_ROLLCALL = "@@chats/CREATE_ROLLCALL",
  DO_ROLLCALL = "@@chats/DO_ROLLCALL",
  CLOSE_ROLLCALL = "@@chats/CLOSE_ROLLCALL",
  UPDATE_ROLLCALL = "@@chats/UPDATE_ROLLCALL",
  GET_ROLLCALL_RECORDS = "@@chats/GET_ROLLCALL_RECORDS",
  GET_ROLLCALL = "@@chats/GET_ROLLCALL",
}

export interface senderModel {
  name: string | null;
  email: string | null;
  id: number | null;
}

export interface channelModel {
  id: number;
  founderID: number;
  name: string;
  recordPath: string;
  deleted: boolean;
}

//contentTypes = ["文字", "圖片", "音訊", "檔案"];
export interface messageModel {
  receiverID: number;
  content: any;
  type: number;
}

export enum MessageTypeEnum {
  text = 0,
  image = 1,
  media = 2,
  file = 3,
  callRecord = 4,
}

export interface messageRecordModel {
  ID: number;
  SenderID: number;
  ReceiverID: number;
  Content: any;
  Type: number;
  Time: string;
}

export interface recentChatUserModel {
  Messages: messageRecordModel[];
  SeenMessageID: number;
  User1: number; // smaller id
  User2: number; // larger id
}

export interface channelPostModel {
  id: number;
  user: userModel;
  content: string;
  deleted: boolean;
  timestamp: string;
}

export interface postCommentModel {
  postID: number;
  id: number;
  user: userModel;
  content: string;
  deleted: boolean;
  timestamp: string;
}

export interface rollCallModel {
  id: number;
  createTime: string;
  startTime: string;
  endTime: string;
}

export interface ChatsState {
  favourites: Array<any>;
  directMessages: Array<any>;
  channels: Array<channelModel>;
  getChannelsError?: string;
  selectedChat: string | number | null;
  chatUserDetails: object;
  chatUserConversations: Array<messageRecordModel>;
  channelPosts: Array<channelPostModel>;
  channelRole: number;
  postComments: Array<postCommentModel>;
  recentChatUsers: Array<recentChatUserModel>;
  isOpenUserDetails: boolean;
  channelDetails: object;
  archiveContacts: Array<any>;
  selectedChatInfo?: userModel | channelModel;
  rollCall?: rollCallModel;
  role?: number | null;
}
