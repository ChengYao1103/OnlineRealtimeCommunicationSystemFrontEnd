import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { ChatsActionTypes } from "./types";
import {
  getChannelMembers as refreshChannelMembers,
  chatsApiResponseSuccess,
  chatsApiResponseError,
} from "./actions";

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
  getChannelMembers as getChannelMembersApi,
  inviteChannelMembers as inviteChannelMembersApi,
  getChannelPosts as getChannelPostsApi,
  toggleFavouriteContact as toggleFavouriteContactApi,
  getArchiveContact as getArchiveContactApi,
  toggleArchiveContact as toggleArchiveContactApi,
  readConversation as readConversationApi,
  deleteImage as deleteImageApi,
  uploadMessageFile as uploadMessageFileApi,
  downloadMessageFile as downloadMessageFileApi,
  createPost as createPostApi,
  createComment as createCommentApi,
  deletePost as deletePostApi,
  deleteComment as deleteCommentApi,
  getPostComments as getPostCommentsApi,
  getRollCall as getRollCallApi,
} from "../../api/index";

import {
  showSuccessNotification,
  showErrorNotification,
} from "../../helpers/notifications";

//actions
import {
  getDirectMessages as getDirectMessagesAction,
  getFavourites as getFavouritesAction,
  getChannels as getChannelsAction,
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
    yield call(showSuccessNotification, "Success!");
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
    yield put(
      chatsApiResponseError(ChatsActionTypes.GET_CHANNEL_POSTS, error)
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
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.CREATE_POST, response)
    );
    yield call(showSuccessNotification, "Success!");
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
    yield call(showSuccessNotification, "Success!");
  } catch (error: any) {
    yield call(showErrorNotification, error.data.message);
    yield put(chatsApiResponseError(ChatsActionTypes.CREATE_COMMENT, error));
  }
}

function* deletePost({ payload: postId }: any) {
  try {
    const response: Promise<any> = yield call(
      deletePostApi,
      postId
    );
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.DELETE_POST, response)
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.DELETE_POST, error));
  }
}

function* deleteComment({ payload: commentId }: any) {
  try {
    const response: Promise<any> = yield call(
      deleteCommentApi,
      commentId
    );
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
    yield put(
      chatsApiResponseError(ChatsActionTypes.GET_POST_COMMENTS, error)
    );
  }
}

function* getRollCall({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getRollCallApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_ROLLCALL, response)
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.GET_ROLLCALL, error)
    );
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
export function* watchGetChannelMembers() {
  yield takeEvery(ChatsActionTypes.GET_CHANNEL_MEMBERS, getChannelMembers);
}
export function* watchInviteChannelMembers() {
  yield takeEvery(
    ChatsActionTypes.INVITE_CHANNEL_MEMBERS,
    inviteChannelMembers
  );
}
export function* watchGetChannelPosts() {
  yield takeEvery(ChatsActionTypes.GET_CHANNEL_POSTS, getChannelPosts);
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

export function* watchGetRollCall() {
  yield takeEvery(ChatsActionTypes.GET_ROLLCALL, getRollCall);
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
    fork(watchGetChannelMembers),
    fork(watchInviteChannelMembers),
    fork(watchGetChannelPosts),
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
    fork(watchGetRollCall),
  ]);
}

export default chatsSaga;
