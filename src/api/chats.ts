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

const getRole = (channelId: string) => {
  let destUrl = `${url.GET_ROLE}/${channelId}`;
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

const kickOutMember = (data: object) => {
  return api.delete(url.KICK_OUT, { data });
};

const getChannelPosts = (data: any) => {
  return api.get(`${url.GET_CHANNEL_POSTS}/${data.ID}`);
};

const getChannelHomeworks = (id: string | number) => {
  return api.get(`${url.GET_CHANNEL_HOMEWORKS}/${id}`);
};

const uploadChannelFile = (data: object) => {
  return api.createWithFile(url.UPLOAD_CHANNEL_FILE, data);
};

const downloadChannelFile = (data: object, filename: string) => {
  return api.getFile(url.DOWNLOAD_CHANNEL_FILE, filename, data);
};

const createChannelDir = (data: object) => {
  return api.create(url.CREATE_CHANNEL_DIRS, data);
};

const getChannelDir = (id: string | number, data: object) => {
  return api.create(`${url.GET_CHANNEL_DIRS}/${id}`, data);
};

const getChannelRollCalls = (id: string | number) => {
  return api.get(`${url.GET_CHANNEL_ROLLCALLS}/${id}`);
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

const notifyChatUserNewFile = (data: any) => {
  let send: WSEvent = {
    event: WSSendEvents.SendFileToUser,
    data: data,
  };
  api.WSSend(JSON.stringify(send));
};

const downloadMessageFile = (data: object, filename: string) => {
  return api.getFile(url.DOWNLOAD_MESSAGE_FILE, filename, data);
};

/* 
post 
*/
const createPost = (data: object) => {
  let send: WSEvent = {
    event: WSSendEvents.MakeNewPost,
    data: data,
  };
  return api.WSSend(JSON.stringify(send));
};

const createComment = (data: object) => {
  let send: WSEvent = {
    event: WSSendEvents.CommentOnPost,
    data: data,
  };
  return api.WSSend(JSON.stringify(send));
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

const closeRollCall = (data: object) => {
  return api.patch(url.CLOSE_ROLLCALL, data);
};

const updateRollCall = (data: object) => {
  return api.patch(url.UPDATE_ROLLCALL, data);
};

// const getRollCallRecords = (id: string | number) => {
//   return api.create(url.GET_ROLLCALL_RECORDS, id);
// };

const getRollCallByChannelID = (id: string | number) => {
  return api.get(`${url.GET_ROLLCALL}/${id}`);
};

const getMyRollCallRecord = (id: string | number) => {
  return api.get(`${url.GET_MY_ROLLCALL_RECORD}/${id}`);
};

const getRollCallRecordsByID = (id: string | number) => {
  return api.get(`${url.GET_ROLLCALL_RECORDS}/${id}`);
};

/* 
homework
*/
const createHomework = (data: object) => {
  return api.create(url.CREATE_HOMEWORK, data);
};

const updateHomework = (data: object) => {
  return api.patch(url.UPDATE_HOMEWORK, data);
};

const closeHomework = (data: object) => {
  return api.patch(url.CLOSE_HOMEWORK, data);
};

const uploadHomework = (data: object) => {
  return api.createWithFile(url.UPLOAD_HOMEWORK, data);
};

const downloadHomework = (data: object, filename: string) => {
  return api.getFile(url.DOWNLOAD_HOMEWORK, filename, data);
};

const setHomeworkScore = (data: object) => {
  return api.patch(url.SET_HOMEWORK_SCORE, data);
};

const getHomeworkScore = (id: string | number) => {
  return api.get(`${url.GET_HOMEWORK_SCORE}/${id}`);
};

const getHomework = (id: string | number) => {
  return api.get(`${url.GET_HOMEWORK}/${id}`);
};

const getAllUpload = (id: string | number) => {
  return api.get(`${url.GET_ALL_UPLOAD}/${id}`);
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
  getRole,
  getChannelDetails,
  getChannelMembers,
  inviteChannelMembers,
  kickOutMember,
  getChannelPosts,
  getChannelHomeworks,
  toggleFavouriteContact,
  getArchiveContact,
  toggleArchiveContact,
  readConversation,
  deleteImage,
  uploadMessageFile,
  notifyChatUserNewFile,
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
  // getRollCallRecords,
  getRollCallByChannelID,
  getMyRollCallRecord,
  getRollCallRecordsByID,
  createHomework,
  updateHomework,
  closeHomework,
  uploadHomework,
  downloadHomework,
  setHomeworkScore,
  getHomeworkScore,
  getHomework,
  uploadChannelFile,
  downloadChannelFile,
  createChannelDir,
  getChannelDir,
  getAllUpload,
  getChannelRollCalls,
};
