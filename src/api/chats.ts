import { messageModel } from "../redux/chats/types";
import { WSEvent, WSSendEvents } from "../repository/wsEvent";
import { APIClient } from "./apiCore";
import * as url from "./urls";

const api = new APIClient();

const getFavourites = () => {
  return api.get(url.GET_FAVOURITES);
};

const getDirectMessages = () => {
  return api.get(url.GET_DIRECT_MESSAGES);
};

const addContacts = (contacts: Array<string | number>) => {
  return api.create(url.ADD_CONTACTS, contacts);
};

const getChatUserDetails = (id: string | number) => {
  return api.get(url.GET_CHAT_USER_DETAILS + "/" + id, { params: { id } });
};

const getChatUserConversations = (data: object) => {
  return api.create(url.GET_CHAT_USER_CONVERSATIONS, data);
};

const getRecentChat = (data: object) => {
  return api.create(url.GET_RECENT_CHAT, data);
};

const sendMessage = (data: messageModel) => {
  let send: WSEvent = {
    event: WSSendEvents.SendContent,
    data: {
      to: data.receiverID,
      type: data.type,
      content: data.content,
    },
  };

  return api.WSSend(JSON.stringify(send));
};

const receiveMessage = (id: string | number) => {
  return api.update(url.RECEIVE_MESSAGE + "/" + id, { params: { id } });
};

const readMessage = (id: string | number) => {
  return api.update(url.READ_MESSAGE + "/" + id, { params: { id } });
};

const receiveMessageFromUser = (id: string | number) => {
  return api.get(url.RECEIVE_MESSAGE_FROM_USER + "/" + id, {
    params: { id },
  });
};

const deleteMessage = (userId: number | string, messageId: number | string) => {
  return api.delete(url.DELETE_MESSAGE + "/" + userId + "/" + messageId, {
    params: { userId, messageId },
  });
};

const forwardMessage = (data: object) => {
  return api.create(url.FORWARD_MESSAGE, data);
};

const deleteUserMessages = (userId: number | string) => {
  return api.delete(url.DELETE_USER_MESSAGES + "/" + userId, {
    params: { userId },
  });
};

const toggleFavouriteContact = (id: string | number) => {
  return api.update(url.TOGGLE_FAVOURITE_CONTACT + "/" + id, {
    params: { id },
  });
};

/*
channel
*/
const createChannel = (data: object) => {
  return api.create(url.CREATE_CHANNEL, data);
};

const getChannels = (userId: string) => {
  let destUrl = `${url.GET_CHANNELS}`;
  return api.get(destUrl);
};

const getChannelDetails = (id: string | number) => {
  return api.get(`${url.GET_CHANNEL_DETAILS}/${id}`);
};

const getChannelMembers = (id: string | number) => {
  return api.get(`${url.GET_CHANNEL_MEMBERS}/${id}`);
};

const inviteChannelMembers = (data: any) => {
  let send: WSEvent = {
    event: WSSendEvents.InviteUserIntoChannel,
    data: data,
  };

  return api.WSSend(JSON.stringify(send));
};

const getChannelPosts = (data: any) => {
  return api.get(`${url.GET_CHANNEL_POSTS}/${data.ID}`);
};
/*
archive
*/
const getArchiveContact = () => {
  return api.get(url.GET_ARCHIVE_CONTACT);
};

const toggleArchiveContact = (id: string | number) => {
  return api.update(url.TOGGLE_ARCHIVE_CONTACT + "/" + id, { params: { id } });
};

const readConversation = (id: string | number) => {
  return api.update(url.READ_CONVERSATION + "/" + id, { params: { id } });
};

const deleteImage = (
  userId: number | string,
  messageId: number | string,
  imageId: number | string
) => {
  return api.delete(url.DELETE_IMAGE + "/" + userId + "/" + messageId, {
    params: { userId, messageId, imageId },
  });
};

const uploadMessageFile = (data: object) => {
  return api.createWithFile(url.UPLOAD_MESSAGE_FILE, data);
};

const downloadMessageFile = (data: object, filename: string) => {
  return api.getFile(url.DOWNLOAD_MESSAGE_FILE, filename, data);
};

/* 
post 
*/
const createPost = (data: object) => {
  return api.create(url.CREATE_POST, data);
};

const createComment = (data: object) => {
  return api.create(url.CREATE_COMMENT, data);
};

const deletePost = (id: string | number) => {
  return api.update(url.DELETE_POST, id);
};

const deleteComment = (id: string | number) => {
  return api.update(url.DELETE_COMMENT, id);
};

const getPostComments = (id: string | number) => {
  return api.get(`${url.GET_POST_COMMENTS}/${id}`);
};

/* 
roll call 
*/
const createRollCall = (data: object) => {
  return api.create(url.CREATE_ROLLCALL, data);
};

const doRollCall = (data: object) => {
  return api.create(url.DO_ROLLCALL, data);
};

const closeRollCall = (id: string | number) => {
  return api.patch(url.CLOSE_ROLLCALL, id);
};

const updateRollCall = (data: object) => {
  return api.patch(url.UPDATE_ROLLCALL, data);
};

const getRollCallRecords = (id: string | number) => {
  return api.create(url.GET_ROLLCALL_RECORDS, id);
};

const getRollCall = (id: string | number) => {
  return api.get(`${url.GET_ROLLCALL}/${id}`);
};

const getRole = (id: string | number) => {
  return api.get(`${url.GET_ROLE}/${id}`);
};

export {
  getFavourites,
  getDirectMessages,
  addContacts,
  getChatUserDetails,
  getChatUserConversations,
  getRecentChat,
  sendMessage,
  receiveMessage,
  readMessage,
  receiveMessageFromUser,
  deleteMessage,
  forwardMessage,
  deleteUserMessages,
  createChannel,
  getChannels,
  getChannelDetails,
  getChannelMembers,
  inviteChannelMembers,
  getChannelPosts,
  toggleFavouriteContact,
  getArchiveContact,
  toggleArchiveContact,
  readConversation,
  deleteImage,
  uploadMessageFile,
  downloadMessageFile,
  createPost,
  createComment,
  deletePost,
  deleteComment,
  getPostComments,
  createRollCall,
  doRollCall,
  closeRollCall,
  updateRollCall,
  getRollCallRecords,
  getRollCall,
  getRole,
};
