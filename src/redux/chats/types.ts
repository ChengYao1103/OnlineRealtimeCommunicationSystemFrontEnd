export enum ChatsActionTypes {
  API_RESPONSE_SUCCESS = "@@chats/API_RESPONSE_SUCCESS",
  API_RESPONSE_ERROR = "@@chats/API_RESPONSE_ERROR",

  GET_FAVOURITES = "@@chats/GET_FAVOURITES",
  GET_DIRECT_MESSAGES = "@@chats/GET_DIRECT_MESSAGES",
  GET_CHANNELS = "@@chats/GET_CHANNELS",

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
}

export interface senderModel {
  name: string | null;
  email: string | null;
  id: number | null;
}
export interface recentChatUserTypes {
  Messages: object;
  SeenMessageID: number;
  User1: number; // smaller id
  User2: number; // larger id
}

export interface channelModel {
  founderID: number;
  id: number;
  name: string;
  recordPath: string;
}

//contentTypes = ["文字", "圖片", "音訊", "檔案"];
export interface messageModel {
  receiverID: number;
  content: any;
  type: number;
}

export interface messageRecordModel {
  SenderID: number;
  ReceiverID: number;
  Content: any;
  Type: number;
  Time: string;
}

export interface ChatsState {
  favourites: Array<any>;
  directMessages: Array<any>;
  channels: Array<channelModel>;
  getChannelsError?: string;
  selectedChat: string | number | null;
  chatUserDetails: object;
  chatUserConversations: {};
  isOpenUserDetails: boolean;
  channelDetails: object;
  archiveContacts: Array<any>;
}
