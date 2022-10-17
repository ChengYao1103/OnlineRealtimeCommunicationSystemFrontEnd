import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { ChatsActionTypes } from "./types";

import {
  getFavourites as getFavouritesApi,
  getDirectMessages as getDirectMessagesApi,
  getChannels as getChannelsApi,
  addContacts as addContactsApi,
  createChannel as createChannelApi,
  getChatUserDetails as getChatUserDetailsApi,
  getChatUserConversations as getChatUserConversationsApi,
  getRecentChat as getRecentChatApi,
  sendMessage as sendMessageApi,
  receiveMessage as receiveMessageApi,
  readMessage as readMessageApi,
  receiveMessageFromUser as receiveMessageFromUserApi,
  deleteMessage as deleteMessageApi,
  forwardMessage as forwardMessageApi,
  deleteUserMessages as deleteUserMessagesApi,
  getChannelDetails as getChannelDetailsApi,
  getRole as getRoleApi,
  getChannelMembers as getChannelMembersApi,
  inviteChannelMembers as inviteChannelMembersApi,
  kickOutMember as kickOutMemberApi,
  getChannelPosts as getChannelPostsApi,
  getChannelHomeworks as getChannelHomeworksApi,
  toggleFavouriteContact as toggleFavouriteContactApi,
  getArchiveContact as getArchiveContactApi,
  toggleArchiveContact as toggleArchiveContactApi,
  readConversation as readConversationApi,
  deleteImage as deleteImageApi,
  uploadMessageFile as uploadMessageFileApi,
  notifyChatUserNewFile as notifyChatUserNewFileApi,
  downloadMessageFile as downloadMessageFileApi,
  createPost as createPostApi,
  createComment as createCommentApi,
  deletePost as deletePostApi,
  deleteComment as deleteCommentApi,
  getPostComments as getPostCommentsApi,
  createRollCall as createRollCallApi,
  updateRollCall as updateRollCallApi,
  closeRollCall as closeRollCallApi,
  getRollCallByChannelID as getRollCallByChannelIDApi,
  getRollCallRecordsByID as getRollCallRecordsByIDApi,
  doRollCall as doRollCallApi,
  createHomework as createHomeworkApi,
  updateHomework as updateHomeworkApi,
  closeHomework as closeHomeworkApi,
  uploadHomework as uploadHomeworkApi,
  downloadHomework as downloadHomeworkApi,
  setHomeworkScore as setHomeworkScoreApi,
  getHomeworkScore as getHomeworkScoreApi,
  getHomework as getHomeworkApi,
  uploadChannelFile as uploadChannelFileApi,
  downloadChannelFile as downloadChannelFileApi,
  createChannelDir as createChannelDirApi,
  getChannelDir as getChannelDirApi,
  getAllUpload as getAllUploadApi,
  getMyRollCallRecord as getMyRollCallRecordApi,
  getChannelRollCalls as getChannelRollCallsApi,
} from "../../api/index";

import {
  showSuccessNotification,
  showErrorNotification,
} from "../../helpers/notifications";

//actions
import {
  getDirectMessages as getDirectMessagesAction,
  getFavourites as getFavouritesAction,
  getChannelMembers as refreshChannelMembers,
  chatsApiResponseSuccess,
  chatsApiResponseError,
} from "./actions";

function* getFavourites() {
  try {
    const response: Promise<any> = yield call(getFavouritesApi);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_FAVOURITES, response)
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.GET_FAVOURITES, error));
  }
}

function* getDirectMessages() {
  try {
    const response: Promise<any> = yield call(getDirectMessagesApi);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_DIRECT_MESSAGES, response)
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.GET_DIRECT_MESSAGES, error)
    );
  }
}

function* getRecentChat({ payload: data }: any) {
  try {
    const response: Promise<any> = yield call(getRecentChatApi, {
      n: data.userAmount,
      m: data.messageAmount,
    });
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_RECENT_CHAT, response)
    );
  } catch (error: any) {
    let message = error.data.message ? error.data.message : error.data.msg;
    yield call(showErrorNotification, message);
    yield put(chatsApiResponseError(ChatsActionTypes.GET_RECENT_CHAT, error));
  }
}

function* addContacts({ payload: contacts }: any) {
  try {
    const response: Promise<any> = yield call(addContactsApi, contacts);
    yield put(chatsApiResponseSuccess(ChatsActionTypes.ADD_CONTACTS, response));
    yield call(showSuccessNotification, response + "");
  } catch (error: any) {
    yield call(showErrorNotification, error);
    yield put(chatsApiResponseError(ChatsActionTypes.ADD_CONTACTS, error));
  }
}

function* getChatUserDetails({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getChatUserDetailsApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_CHAT_USER_DETAILS, response)
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.GET_CHAT_USER_DETAILS, error)
    );
  }
}

function* getChatUserConversations({ payload: data }: any) {
  try {
    const response: Promise<any> = yield call(
      getChatUserConversationsApi,
      data
    );
    yield put(
      chatsApiResponseSuccess(
        ChatsActionTypes.GET_CHAT_USER_CONVERSATIONS,
        response
      )
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.GET_CHAT_USER_CONVERSATIONS, error)
    );
  }
}

function* onSendMessage({ payload: data }: any) {
  try {
    const response: Promise<any> = yield call(sendMessageApi, data);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.ON_SEND_MESSAGE, response)
    );
  } catch (error: any) {
    let message = error.data.message ? error.data.message : error.data.msg;
    yield call(showErrorNotification, message);
    yield put(chatsApiResponseError(ChatsActionTypes.ON_SEND_MESSAGE, error));
  }
}

function* receiveMessage({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(receiveMessageApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.RECEIVE_MESSAGE, response)
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.RECEIVE_MESSAGE, error));
  }
}

function* readMessage({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(readMessageApi, id);
    yield put(chatsApiResponseSuccess(ChatsActionTypes.READ_MESSAGE, response));
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.READ_MESSAGE, error));
  }
}

function* receiveMessageFromUser({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(receiveMessageFromUserApi, id);
    yield put(
      chatsApiResponseSuccess(
        ChatsActionTypes.RECEIVE_MESSAGE_FROM_USER,
        response
      )
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.RECEIVE_MESSAGE_FROM_USER, error)
    );
  }
}

function* deleteMessage({ payload: { userId, messageId } }: any) {
  try {
    const response: Promise<any> = yield call(
      deleteMessageApi,
      userId,
      messageId
    );
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.DELETE_MESSAGE, response)
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.DELETE_MESSAGE, error));
  }
}

function* forwardMessage({ payload: data }: any) {
  try {
    const response: Promise<any> = yield call(forwardMessageApi, data);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.FORWARD_MESSAGE, response)
    );
    yield call(showSuccessNotification, response + "");
  } catch (error: any) {
    yield call(showErrorNotification, error + "");
    yield put(chatsApiResponseError(ChatsActionTypes.FORWARD_MESSAGE, error));
  }
}

function* deleteUserMessages({ payload: userId }: any) {
  try {
    const response: Promise<any> = yield call(deleteUserMessagesApi, userId);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.DELETE_USER_MESSAGES, response)
    );
    yield call(showSuccessNotification, response + "");
  } catch (error: any) {
    yield call(showErrorNotification, error + "");
    yield put(
      chatsApiResponseError(ChatsActionTypes.DELETE_USER_MESSAGES, error)
    );
  }
}

function* createChannel({ payload: channelData }: any) {
  try {
    const response: Promise<any> = yield call(createChannelApi, channelData);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.CREATE_CHANNEL, response)
    );
    yield call(showSuccessNotification, "建立頻道成功");
  } catch (error: any) {
    yield call(showErrorNotification, error.data.message);
    yield put(chatsApiResponseError(ChatsActionTypes.CREATE_CHANNEL, error));
  }
}

function* getChannels({ payload: data }: any) {
  try {
    const response: Promise<any> = yield call(getChannelsApi, data.userId);
    yield put(chatsApiResponseSuccess(ChatsActionTypes.GET_CHANNELS, response));
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.GET_CHANNELS, error));
  }
}

function* getChannelDetails({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getChannelDetailsApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_CHANNEL_DETAILS, response)
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.GET_CHANNEL_DETAILS, error)
    );
  }
}

function* getRole({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getRoleApi, id.toString());
    yield put(chatsApiResponseSuccess(ChatsActionTypes.GET_ROLE, response));
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.GET_ROLE, error));
  }
}

function* getChannelMembers({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getChannelMembersApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_CHANNEL_MEMBERS, response)
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.GET_CHANNEL_MEMBERS, error)
    );
  }
}

function* inviteChannelMembers({ payload: data }: any) {
  try {
    const response: Promise<any> = yield call(inviteChannelMembersApi, data);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.INVITE_CHANNEL_MEMBERS, response)
    );
    yield call(showSuccessNotification, "Invite successfully sent!");
    yield put(refreshChannelMembers(data.channelID));
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.INVITE_CHANNEL_MEMBERS, error)
    );
  }
}

function* getChannelPosts({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getChannelPostsApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_CHANNEL_POSTS, response)
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.GET_CHANNEL_POSTS, error));
  }
}

function* kickOutMember({ payload: data }: any) {
  try {
    yield call(kickOutMemberApi, data);
    yield call(showSuccessNotification, "成功");
    yield put(refreshChannelMembers(data.channelID));
  } catch (error: any) {
    yield call(showErrorNotification, "發生問題");
  }
}

function* getChannelHomeworks({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getChannelHomeworksApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_CHANNEL_HOMEWORKS, response)
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.GET_CHANNEL_HOMEWORKS, error)
    );
  }
}

function* getChannelRollCalls({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getChannelRollCallsApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_CHANNEL_ROLLCALLS, response)
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.GET_CHANNEL_ROLLCALLS, error)
    );
  }
}

function* toggleFavouriteContact({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(toggleFavouriteContactApi, id);
    yield put(
      chatsApiResponseSuccess(
        ChatsActionTypes.TOGGLE_FAVOURITE_CONTACT,
        response
      )
    );
    yield call(showSuccessNotification, response + "");
  } catch (error: any) {
    yield call(showErrorNotification, error + "");
    yield put(
      chatsApiResponseError(ChatsActionTypes.TOGGLE_FAVOURITE_CONTACT, error)
    );
  }
}

function* getArchiveContact() {
  try {
    const response: Promise<any> = yield call(getArchiveContactApi);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_ARCHIVE_CONTACT, response)
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.GET_ARCHIVE_CONTACT, error)
    );
  }
}

function* toggleArchiveContact({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(toggleArchiveContactApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.TOGGLE_ARCHIVE_CONTACT, response)
    );
    yield call(showSuccessNotification, response + "");
  } catch (error: any) {
    yield call(showErrorNotification, error + "");
    yield put(
      chatsApiResponseError(ChatsActionTypes.TOGGLE_ARCHIVE_CONTACT, error)
    );
  }
}

function* readConversation({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(readConversationApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.READ_CONVERSATION, response)
    );
    yield put(getDirectMessagesAction());
    yield put(getFavouritesAction());
    //yield put(getChannelsAction());
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.READ_CONVERSATION, error));
  }
}

function* deleteImage({ payload: { userId, messageId, imageId } }: any) {
  try {
    const response: Promise<any> = yield call(
      deleteImageApi,
      userId,
      messageId,
      imageId
    );
    yield put(chatsApiResponseSuccess(ChatsActionTypes.DELETE_IMAGE, response));
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.DELETE_IMAGE, error));
  }
}

function* uploadMessageFile({ payload: data }: any) {
  try {
    const response: Promise<any> = yield call(uploadMessageFileApi, data);
    console.log(response);
    let wsData = {
      to: data.receiverID,
      messageID: (response as any).id,
    };
    yield call(notifyChatUserNewFileApi, wsData);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.UPLOAD_MESSAGE_FILE, response)
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.UPLOAD_MESSAGE_FILE, error)
    );
  }
}

function* downloadMessageFile({ payload: { data, filename } }: any) {
  try {
    const response: Promise<any> = yield call(
      downloadMessageFileApi,
      data,
      filename
    );
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.DOWNLOAD_MESSAGE_FILE, response)
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.DOWNLOAD_MESSAGE_FILE, error)
    );
  }
}

function* createPost({ payload: postData }: any) {
  try {
    const response: Promise<any> = yield call(createPostApi, postData);
    yield put(chatsApiResponseSuccess(ChatsActionTypes.CREATE_POST, response));
    yield call(showSuccessNotification, "發文成功!");
  } catch (error: any) {
    yield call(showErrorNotification, error.data.message);
    yield put(chatsApiResponseError(ChatsActionTypes.CREATE_POST, error));
  }
}

function* createComment({ payload: commentData }: any) {
  try {
    const response: Promise<any> = yield call(createCommentApi, commentData);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.CREATE_COMMENT, response)
    );
    yield call(showSuccessNotification, "留言成功!");
  } catch (error: any) {
    yield call(showErrorNotification, error.data.message);
    yield put(chatsApiResponseError(ChatsActionTypes.CREATE_COMMENT, error));
  }
}

function* deletePost({ payload: postId }: any) {
  try {
    const response: Promise<any> = yield call(deletePostApi, postId);
    yield put(chatsApiResponseSuccess(ChatsActionTypes.DELETE_POST, response));
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.DELETE_POST, error));
  }
}

function* deleteComment({ payload: commentId }: any) {
  try {
    const response: Promise<any> = yield call(deleteCommentApi, commentId);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.DELETE_COMMENT, response)
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.DELETE_COMMENT, error));
  }
}

function* getPostComments({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getPostCommentsApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_POST_COMMENTS, response)
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.GET_POST_COMMENTS, error));
  }
}

function* createRollCall({ payload: rollCallData }: any) {
  try {
    const response: Promise<any> = yield call(createRollCallApi, rollCallData);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.CREATE_ROLLCALL, response)
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.CREATE_ROLLCALL, error));
  }
}

function* updateRollCall({ payload: HomeworkData }: any) {
  try {
    const response: Promise<any> = yield call(updateRollCallApi, HomeworkData);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.UPDATE_HOMEWORK, response)
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.UPDATE_HOMEWORK, error));
  }
}

function* closeRollCall({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(closeRollCallApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.CLOSE_ROLLCALL, response)
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.CLOSE_ROLLCALL, error));
  }
}

function* getRollCall({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getRollCallByChannelIDApi, id);
    yield put(chatsApiResponseSuccess(ChatsActionTypes.GET_ROLLCALL_BY_CHANNELID, response));
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.GET_ROLLCALL_BY_CHANNELID, error));
  }
}

function* doRollCall({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(doRollCallApi, id);
    yield put(chatsApiResponseSuccess(ChatsActionTypes.DO_ROLLCALL, response));
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.DO_ROLLCALL, error));
  }
}


function* getRollCallRecordsByID({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getRollCallRecordsByIDApi, id);
    yield put(chatsApiResponseSuccess(ChatsActionTypes.GET_ROLLCALL_RECORDS_BY_ID, response));
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.GET_ROLLCALL_RECORDS_BY_ID, error));
  }
}

function* getMyRollCallRecord({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getMyRollCallRecordApi, id);
    yield put(chatsApiResponseSuccess(ChatsActionTypes.GET_MY_ROLLCALL_RECORD, response));
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.GET_MY_ROLLCALL_RECORD, error));
  }
}

function* createHomework({ payload: homeworkData }: any) {
  try {
    const response: Promise<any> = yield call(createHomeworkApi, homeworkData);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.CREATE_HOMEWORK, response)
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.CREATE_HOMEWORK, error));
  }
}

function* updateHomework({ payload: homeworkData }: any) {
  try {
    const response: Promise<any> = yield call(updateHomeworkApi, homeworkData);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.UPDATE_HOMEWORK, response)
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.UPDATE_HOMEWORK, error));
  }
}

function* closeHomework({ payload: data }: any) {
  try {
    const response: Promise<any> = yield call(closeHomeworkApi, data);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.CLOSE_HOMEWORK, response)
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.CLOSE_HOMEWORK, error));
  }
}

function* getHomework({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getHomeworkApi, id);
    yield put(chatsApiResponseSuccess(ChatsActionTypes.GET_HOMEWORK, response));
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.GET_HOMEWORK, error));
  }
}

function* uploadHomework({ payload: data }: any) {
  try {
    const response: Promise<any> = yield call(uploadHomeworkApi, data);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.UPLOAD_HOMEWORK, response)
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.UPLOAD_HOMEWORK, error));
  }
}

function* downloadHomework({ payload: { data, filename } }: any) {
  try {
    const response: Promise<any> = yield call(
      downloadHomeworkApi,
      data,
      filename
    );
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.DOWNLOAD_HOMEWORK, response)
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.DOWNLOAD_HOMEWORK, error));
  }
}

function* setHomeworkScore({ payload: data }: any) {
  try {
    const response: Promise<any> = yield call(setHomeworkScoreApi, data);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.SET_HOMEWORK_SCORE, response)
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.SET_HOMEWORK_SCORE, error)
    );
  }
}

function* getHomeworkScore({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getHomeworkScoreApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_HOMEWORK_SCORE, response)
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.GET_HOMEWORK_SCORE, error)
    );
  }
}

function* uploadChannelFile({ payload: data }: any) {
  try {
    const response: Promise<any> = yield call(uploadChannelFileApi, data);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.UPLOAD_CHANNEL_FILE, response)
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.UPLOAD_CHANNEL_FILE, error)
    );
  }
}

function* downloadChannelFile({ payload: { data, filename } }: any) {
  try {
    const response: Promise<any> = yield call(
      downloadChannelFileApi,
      data,
      filename
    );
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.DOWNLOAD_CHANNEL_FILE, response)
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.DOWNLOAD_CHANNEL_FILE, error)
    );
  }
}

function* createChannelDir({ payload: dirData }: any) {
  try {
    const response: Promise<any> = yield call(createChannelDirApi, dirData);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.CREATE_CHANNEL_DIRS, response)
    );
    yield call(showSuccessNotification, "資料夾建立成功!");
  } catch (error: any) {
    yield call(showErrorNotification, error.data.message);
    yield put(
      chatsApiResponseError(ChatsActionTypes.CREATE_CHANNEL_DIRS, error)
    );
  }
}

function* getChannelDir({ payload: id, data }: any) {
  try {
    const response: Promise<any> = yield call(getChannelDirApi, id, data);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_CHANNEL_DIRS, response)
    );
  } catch (error: any) {
    yield call(showErrorNotification, error.data.message);
    yield put(chatsApiResponseError(ChatsActionTypes.GET_CHANNEL_DIRS, error));
  }
}

function* getAllUpload({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getAllUploadApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_ALL_UPLOAD, response)
    );
  } catch (error: any) {
    yield call(showErrorNotification, error.data.message);
    yield put(chatsApiResponseError(ChatsActionTypes.GET_ALL_UPLOAD, error));
  }
}

export function* watchGetFavourites() {
  yield takeEvery(ChatsActionTypes.GET_FAVOURITES, getFavourites);
}

export function* watchGetDirectMessages() {
  yield takeEvery(ChatsActionTypes.GET_DIRECT_MESSAGES, getDirectMessages);
}
export function* watchAddContacts() {
  yield takeEvery(ChatsActionTypes.ADD_CONTACTS, addContacts);
}
export function* watchGetChatUserDetails() {
  yield takeEvery(ChatsActionTypes.GET_CHAT_USER_DETAILS, getChatUserDetails);
}
export function* watchGetChatUserConversations() {
  yield takeEvery(
    ChatsActionTypes.GET_CHAT_USER_CONVERSATIONS,
    getChatUserConversations
  );
}
export function* watchGetRecentChat() {
  yield takeEvery(ChatsActionTypes.GET_RECENT_CHAT, getRecentChat);
}
export function* watchOnSendMessage() {
  yield takeEvery(ChatsActionTypes.ON_SEND_MESSAGE, onSendMessage);
}
export function* watchReceiveMessage() {
  yield takeEvery(ChatsActionTypes.RECEIVE_MESSAGE, receiveMessage);
}
export function* watchReadMessage() {
  yield takeEvery(ChatsActionTypes.READ_MESSAGE, readMessage);
}
export function* watchReceiveMessageFromUser() {
  yield takeEvery(
    ChatsActionTypes.RECEIVE_MESSAGE_FROM_USER,
    receiveMessageFromUser
  );
}
export function* watchDeleteMessage() {
  yield takeEvery(ChatsActionTypes.DELETE_MESSAGE, deleteMessage);
}
export function* watchForwardMessage() {
  yield takeEvery(ChatsActionTypes.FORWARD_MESSAGE, forwardMessage);
}
export function* watchDeleteUserMessages() {
  yield takeEvery(ChatsActionTypes.DELETE_USER_MESSAGES, deleteUserMessages);
}
export function* watchCreateChannel() {
  yield takeEvery(ChatsActionTypes.CREATE_CHANNEL, createChannel);
}
export function* watchGetChannels() {
  yield takeEvery(ChatsActionTypes.GET_CHANNELS, getChannels);
}
export function* watchGetChannelDetails() {
  yield takeEvery(ChatsActionTypes.GET_CHANNEL_DETAILS, getChannelDetails);
}
export function* watchGetRole() {
  yield takeEvery(ChatsActionTypes.GET_ROLE, getRole);
}
export function* watchGetChannelMembers() {
  yield takeEvery(ChatsActionTypes.GET_CHANNEL_MEMBERS, getChannelMembers);
}
export function* watchInviteChannelMembers() {
  yield takeEvery(
    ChatsActionTypes.INVITE_CHANNEL_MEMBERS,
    inviteChannelMembers
  );
}
export function* watchKickOutMember() {
  yield takeEvery(ChatsActionTypes.KICK_OUT_MEMBER, kickOutMember);
}
export function* watchGetChannelPosts() {
  yield takeEvery(ChatsActionTypes.GET_CHANNEL_POSTS, getChannelPosts);
}
export function* watchGetChannelHomeworks() {
  yield takeEvery(ChatsActionTypes.GET_CHANNEL_HOMEWORKS, getChannelHomeworks);
}
export function* watchGetChannelRollCalls() {
  yield takeEvery(ChatsActionTypes.GET_CHANNEL_ROLLCALLS, getChannelRollCalls);
}
export function* watchToggleFavouriteContact() {
  yield takeEvery(
    ChatsActionTypes.TOGGLE_FAVOURITE_CONTACT,
    toggleFavouriteContact
  );
}
export function* watchGetArchiveContact() {
  yield takeEvery(ChatsActionTypes.GET_ARCHIVE_CONTACT, getArchiveContact);
}
export function* watchToggleArchiveContact() {
  yield takeEvery(
    ChatsActionTypes.TOGGLE_ARCHIVE_CONTACT,
    toggleArchiveContact
  );
}
export function* watchReadConversation() {
  yield takeEvery(ChatsActionTypes.READ_CONVERSATION, readConversation);
}
export function* watchDeleteImage() {
  yield takeEvery(ChatsActionTypes.DELETE_IMAGE, deleteImage);
}

export function* watchUploadMessageFile() {
  yield takeEvery(ChatsActionTypes.UPLOAD_MESSAGE_FILE, uploadMessageFile);
}

export function* watchDownloadMessageFile() {
  yield takeEvery(ChatsActionTypes.DOWNLOAD_MESSAGE_FILE, downloadMessageFile);
}

export function* watchCreatePost() {
  yield takeEvery(ChatsActionTypes.CREATE_POST, createPost);
}

export function* watchCreateComment() {
  yield takeEvery(ChatsActionTypes.CREATE_COMMENT, createComment);
}
export function* watchDeletePost() {
  yield takeEvery(ChatsActionTypes.DELETE_POST, deletePost);
}

export function* watchDeleteComment() {
  yield takeEvery(ChatsActionTypes.DELETE_COMMENT, deleteComment);
}

export function* watchGetPostComments() {
  yield takeEvery(ChatsActionTypes.GET_POST_COMMENTS, getPostComments);
}

export function* watchCreateRollCall() {
  yield takeEvery(ChatsActionTypes.CREATE_ROLLCALL, createRollCall);
}

export function* watchUpdateRollCall() {
  yield takeEvery(ChatsActionTypes.UPDATE_ROLLCALL, updateRollCall);
}

export function* watchCloseRollCall() {
  yield takeEvery(ChatsActionTypes.CLOSE_ROLLCALL, closeRollCall);
}

export function* watchGetRollCall() {
  yield takeEvery(ChatsActionTypes.GET_ROLLCALL_BY_CHANNELID, getRollCall);
}

export function* watchDoRollCall() {
  yield takeEvery(ChatsActionTypes.DO_ROLLCALL, doRollCall);
}

export function* watchGetRollCallRecordByID() {
  yield takeEvery(ChatsActionTypes.GET_ROLLCALL_RECORDS_BY_ID, getRollCallRecordsByID);
}

export function* watchGetMyRollCallRecord() {
  yield takeEvery(ChatsActionTypes.GET_MY_ROLLCALL_RECORD, getMyRollCallRecord);
}

export function* watchCreateHomework() {
  yield takeEvery(ChatsActionTypes.CREATE_HOMEWORK, createHomework);
}

export function* watchUpdateHomework() {
  yield takeEvery(ChatsActionTypes.UPDATE_HOMEWORK, updateHomework);
}

export function* watchCloseHomework() {
  yield takeEvery(ChatsActionTypes.CLOSE_HOMEWORK, closeHomework);
}

export function* watchUploadHomework() {
  yield takeEvery(ChatsActionTypes.UPLOAD_HOMEWORK, uploadHomework);
}

export function* watchDownloadHomework() {
  yield takeEvery(ChatsActionTypes.DOWNLOAD_HOMEWORK, downloadHomework);
}

export function* watchGetHomework() {
  yield takeEvery(ChatsActionTypes.GET_HOMEWORK, getHomework);
}

export function* watchSetHomewokScore() {
  yield takeEvery(ChatsActionTypes.SET_HOMEWORK_SCORE, setHomeworkScore);
}

export function* watchGetHomewokScore() {
  yield takeEvery(ChatsActionTypes.GET_HOMEWORK_SCORE, getHomeworkScore);
}

export function* watchCreateChannelDir() {
  yield takeEvery(ChatsActionTypes.CREATE_CHANNEL_DIRS, createChannelDir);
}

export function* watchGetChannelDir() {
  yield takeEvery(ChatsActionTypes.GET_CHANNEL_DIRS, getChannelDir);
}

export function* watchUploadChannelFile() {
  yield takeEvery(ChatsActionTypes.UPLOAD_CHANNEL_FILE, uploadChannelFile);
}

export function* watchDownloadChannelFile() {
  yield takeEvery(ChatsActionTypes.DOWNLOAD_CHANNEL_FILE, downloadChannelFile);
}

export function* watchGetAllUpload() {
  yield takeEvery(ChatsActionTypes.GET_ALL_UPLOAD, getAllUpload);
}

function* chatsSaga() {
  yield all([
    fork(watchGetFavourites),
    fork(watchGetDirectMessages),
    fork(watchAddContacts),
    fork(watchGetChatUserDetails),
    fork(watchGetChatUserConversations),
    fork(watchGetRecentChat),
    fork(watchOnSendMessage),
    fork(watchReceiveMessage),
    fork(watchReadMessage),
    fork(watchReceiveMessageFromUser),
    fork(watchDeleteMessage),
    fork(watchForwardMessage),
    fork(watchDeleteUserMessages),
    fork(watchCreateChannel),
    fork(watchGetChannels),
    fork(watchGetChannelDetails),
    fork(watchGetRole),
    fork(watchGetChannelMembers),
    fork(watchInviteChannelMembers),
    fork(watchKickOutMember),
    fork(watchGetChannelPosts),
    fork(watchGetChannelHomeworks),
    fork(watchToggleFavouriteContact),
    fork(watchGetArchiveContact),
    fork(watchToggleArchiveContact),
    fork(watchReadConversation),
    fork(watchDeleteImage),
    fork(watchUploadMessageFile),
    fork(watchDownloadMessageFile),
    fork(watchCreatePost),
    fork(watchCreateComment),
    fork(watchDeletePost),
    fork(watchDeleteComment),
    fork(watchGetPostComments),
    fork(watchCreateRollCall),
    fork(watchUpdateRollCall),
    fork(watchCloseRollCall),
    fork(watchGetRollCall),
    fork(watchDoRollCall),
    fork(watchGetRollCallRecordByID),
    fork(watchGetMyRollCallRecord),
    fork(watchGetRole),
    fork(watchCreateHomework),
    fork(watchUpdateHomework),
    fork(watchCloseHomework),
    fork(watchUploadHomework),
    fork(watchDownloadHomework),
    fork(watchGetHomework),
    fork(watchSetHomewokScore),
    fork(watchGetHomewokScore),
    fork(watchCreateChannelDir),
    fork(watchGetChannelDir),
    fork(watchUploadChannelFile),
    fork(watchDownloadChannelFile),
    fork(watchGetAllUpload),
    fork(watchGetChannelRollCalls),
  ]);
}

export default chatsSaga;
