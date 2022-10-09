import { RoleTypes } from "../../repository/Enum";
import { userModel } from "../auth/types";
import { channelModel, ChatsActionTypes, messageRecordModel } from "./types";

// common success
export const chatsApiResponseSuccess = (actionType: string, data: any) => ({
  type: ChatsActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const chatsApiResponseError = (actionType: string, error: string) => ({
  type: ChatsActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// websocket event
export const chatWebsocketEvent = (actionType: string, data: any) => ({
  type: ChatsActionTypes.WS_EVENT,
  payload: { actionType, data },
});

export const getFavourites = () => ({
  type: ChatsActionTypes.GET_FAVOURITES,
});

export const getDirectMessages = () => ({
  type: ChatsActionTypes.GET_DIRECT_MESSAGES,
});

export const getRecentChat = (userAmount: number, messageAmount: number) => ({
  type: ChatsActionTypes.GET_RECENT_CHAT,
  payload: { userAmount, messageAmount },
});

export const addContacts = (contacts: Array<string | number>) => ({
  type: ChatsActionTypes.ADD_CONTACTS,
  payload: contacts,
});

export const getChannels = (userId: string) => ({
  type: ChatsActionTypes.GET_CHANNELS,
  payload: { userId },
});

export const changeSelectedChat = (
  selectedChat: string | number | null,
  selectedChatInfo?: userModel | channelModel
) => ({
  type: ChatsActionTypes.CHANGE_SELECTED_CHAT,
  payload: { selectedChat, selectedChatInfo },
});

export const getChatUserDetails = (selectedChat: string | number | null) => ({
  type: ChatsActionTypes.GET_CHAT_USER_DETAILS,
  payload: selectedChat,
});

export const getChatUserConversations = (data: any) => ({
  type: ChatsActionTypes.GET_CHAT_USER_CONVERSATIONS,
  payload: data,
});

export const receiveNewMessage = (message: messageRecordModel) => ({
  type: ChatsActionTypes.RECEIVE_MESSAGE,
  payload: message,
});

export const toggleUserDetailsTab = (value: boolean) => ({
  type: ChatsActionTypes.TOGGLE_USER_DETAILS_TAB,
  payload: value,
});

export const onSendMessage = (data: any) => ({
  type: ChatsActionTypes.ON_SEND_MESSAGE,
  payload: data,
});

export const receiveMessage = (id: number | string) => ({
  type: ChatsActionTypes.RECEIVE_MESSAGE,
  payload: id,
});

export const readMessage = (id: number | string) => ({
  type: ChatsActionTypes.READ_MESSAGE,
  payload: id,
});

export const receiveMessageFromUser = (id: number | string) => ({
  type: ChatsActionTypes.RECEIVE_MESSAGE_FROM_USER,
  payload: id,
});

export const deleteMessage = (
  userId: number | string,
  messageId: number | string
) => ({
  type: ChatsActionTypes.DELETE_MESSAGE,
  payload: { userId, messageId },
});

export const forwardMessage = (data: object) => ({
  type: ChatsActionTypes.FORWARD_MESSAGE,
  payload: data,
});

export const deleteUserMessages = (userId: number | string) => ({
  type: ChatsActionTypes.DELETE_USER_MESSAGES,
  payload: userId,
});

/*
channels
*/
export interface CreateChannelPostData {
  founderId: number;
  name: string;
  //members: Array<string | number>;
  //description?: string;
}
export const createChannel = (channelData: CreateChannelPostData) => ({
  type: ChatsActionTypes.CREATE_CHANNEL,
  payload: channelData,
});

export const getRole = (id: number) => ({
  type: ChatsActionTypes.GET_ROLE,
  payload: id,
});

export const getChannelDetails = (id: number | string) => ({
  type: ChatsActionTypes.GET_CHANNEL_DETAILS,
  payload: id,
});

export const getChannelMembers = (id: number | string) => ({
  type: ChatsActionTypes.GET_CHANNEL_MEMBERS,
  payload: id,
});

export const inviteChannelMembers = (
  channelID: number,
  emailArray: string[],
  roleArray: RoleTypes[]
) => ({
  type: ChatsActionTypes.INVITE_CHANNEL_MEMBERS,
  payload: { channelID, emailArray, roleArray },
});

export const kickOutMember = (channelID: number, userID: number) => ({
  type: ChatsActionTypes.KICK_OUT_MEMBER,
  payload: { channelID, userID },
});

export const getChannelPosts = (data: any) => ({
  type: ChatsActionTypes.GET_CHANNEL_POSTS,
  payload: data,
});

export const toggleFavouriteContact = (id: number | string) => ({
  type: ChatsActionTypes.TOGGLE_FAVOURITE_CONTACT,
  payload: id,
});

export const getArchiveContact = () => ({
  type: ChatsActionTypes.GET_ARCHIVE_CONTACT,
});

export const toggleArchiveContact = (id: number | string) => ({
  type: ChatsActionTypes.TOGGLE_ARCHIVE_CONTACT,
  payload: id,
});

export const readConversation = (id: number | string) => ({
  type: ChatsActionTypes.READ_CONVERSATION,
  payload: id,
});

export const deleteImage = (
  userId: number | string,
  messageId: number | string,
  imageId: number | string
) => ({
  type: ChatsActionTypes.DELETE_IMAGE,
  payload: { userId, messageId, imageId },
});

export const uploadMessageFile = (data: any) => ({
  type: ChatsActionTypes.UPLOAD_MESSAGE_FILE,
  payload: data,
});

export const downloadMessageFile = (filename: string, data: any) => ({
  type: ChatsActionTypes.DOWNLOAD_MESSAGE_FILE,
  payload: { data, filename },
});

export const createPost = (data: any) => ({
  type: ChatsActionTypes.CREATE_POST,
  payload: data,
});

export const createComment = (data: any) => ({
  type: ChatsActionTypes.CREATE_COMMENT,
  payload: data,
});

export const deletePost = (id: number | string) => ({
  type: ChatsActionTypes.DELETE_POST,
  payload: id,
});

export const deleteComment = (id: number | string) => ({
  type: ChatsActionTypes.DELETE_COMMENT,
  payload: id,
});

export const getPostComments = (id: number | string) => ({
  type: ChatsActionTypes.GET_POST_COMMENTS,
  payload: id,
});

export const createRollCall = (data: any) => ({
  type: ChatsActionTypes.CREATE_ROLLCALL,
  payload: data,
});

export const doRollCall = (data: any) => ({
  type: ChatsActionTypes.DO_ROLLCALL,
  payload: data,
});

export const closeRollCall = (id: number | string) => ({
  type: ChatsActionTypes.CLOSE_ROLLCALL,
  payload: id,
});

export const updateRollCall = (data: any) => ({
  type: ChatsActionTypes.UPDATE_ROLLCALL,
  payload: data,
});

export const getRollCallRecords = (id: number | string) => ({
  type: ChatsActionTypes.GET_ROLLCALL_RECORDS,
  payload: id,
});

export const getRollCall = (id: number | string) => ({
  type: ChatsActionTypes.GET_ROLLCALL,
  payload: id,
});
