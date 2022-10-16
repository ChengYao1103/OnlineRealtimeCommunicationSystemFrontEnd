import { persistReducer } from "redux-persist";
import { toast } from "react-toastify";
import storage from "redux-persist/lib/storage";
// types
import {
  messageRecordModel,
  ChatsActionTypes,
  ChatsState,
  channelMemberModel,
  channelModel,
  channelPostModel,
  postCommentModel,
} from "./types";
import { number } from "yup";
import { userModel } from "../auth/types";

export const INIT_STATE: ChatsState = {
  favourites: [],
  directMessages: [],
  channels: [],
  getChannelsError: undefined,
  selectedChat: null,
  chatUserDetails: {},
  chatUserConversations: [],
  channelPosts: [],
  channelHomeworks: [],
  channelRollCalls: [],
  channelRole: -1,
  postComments: [],
  isOpenUserDetails: false,
  channelDetails: {},
  archiveContacts: [],
  recentChatUsers: [],
  selectedChatInfo: undefined,
  rollCall: undefined,
  homework: undefined,
  selectedHomework: null,
  channelDir: [],
  isDir: [],
  selectedDir: null,
  homeworkUploads: [],
  rollCallRecords: [],
  myRollCallRecord: null,
  selectedRollCall: null,
  channelMembers: [],
};

const Chats = persistReducer(
  {
    storage,
    key: "orcsChat",
    whitelist: [],
  },
  (state: ChatsState = INIT_STATE, action: any) => {
    switch (action.type) {
      case ChatsActionTypes.API_RESPONSE_SUCCESS:
        switch (action.payload.actionType) {
          case ChatsActionTypes.GET_FAVOURITES:
            return {
              ...state,
              favourites: action.payload.data,
              isFavouritesFetched: true,
              getFavouritesLoading: false,
            };
          case ChatsActionTypes.GET_DIRECT_MESSAGES:
            return {
              ...state,
              directMessages: action.payload.data,
              isDirectMessagesFetched: true,
              getDirectMessagesLoading: false,
              isContactsAdded: false,
            };
          case ChatsActionTypes.ADD_CONTACTS:
            return {
              ...state,
              isContactsAdded: true,
              addContactsLoading: false,
            };
          case ChatsActionTypes.GET_CHAT_USER_DETAILS:
            return {
              ...state,
              chatUserDetails: action.payload.data,
              isUserDetailsFetched: true,
              getUserDetailsLoading: false,
            };
          case ChatsActionTypes.GET_CHAT_USER_CONVERSATIONS:
            var conversations = action.payload.data.message.Messages;
            conversations.forEach((conversation: messageRecordModel) => {
              state.chatUserConversations.unshift(conversation);
            });
            return {
              ...state,
              isUserConversationsFetched: true,
              getUserConversationsLoading: false,
              isUserMessageSent: false,
              isMessageDeleted: false,
              isMessageForwarded: false,
            };
          case ChatsActionTypes.GET_RECENT_CHAT:
            return {
              ...state,
              recentChatUsers:
                action.payload.data.recentChatUser.GetMessageRecordResult,
            };
          case ChatsActionTypes.ON_SEND_MESSAGE:
            return {
              ...state,
              // messageID: action.payload.data.id,
              isUserMessageSent: true,
            };
          case ChatsActionTypes.RECEIVE_MESSAGE:
          case ChatsActionTypes.RECEIVE_MESSAGE_FROM_USER:
            return {
              ...state,
              chatUserConversations: action.payload.data,
            };
          case ChatsActionTypes.READ_MESSAGE:
            return {
              ...state,
              isMessageRead: true,
              chatUserConversations: action.payload.data,
            };
          case ChatsActionTypes.DELETE_MESSAGE:
            return {
              ...state,
              isMessageDeleted: true,
            };
          case ChatsActionTypes.FORWARD_MESSAGE:
            return {
              ...state,
              isMessageForwarded: true,
            };
          case ChatsActionTypes.DELETE_USER_MESSAGES:
            return {
              ...state,
              isUserMessagesDeleted: true,
            };
          case ChatsActionTypes.CREATE_CHANNEL:
            return {
              ...state,
              isChannelCreated: true,
              createChannelLoading: false,
            };
          case ChatsActionTypes.GET_CHANNELS:
            return {
              ...state,
              channels: action.payload.data.channel,
              isChannelsFetched: true,
              getChannelsLoading: false,
              isChannelCreated: false,
            };
          case ChatsActionTypes.GET_CHANNEL_DETAILS:
            return {
              ...state,
              chatUserDetails: { ...action.payload.data, isChannel: true },
              isChannelDetailsFetched: true,
              getUserDetailsLoading: false,
            };

          case ChatsActionTypes.GET_ROLE:
            return {
              ...state,
              channelRole: action.payload.data.role,
            };
          case ChatsActionTypes.GET_CHANNEL_MEMBERS:
            var channelMembers = action.payload.data.users;
            channelMembers.sort(
              (a: channelMemberModel, b: channelMemberModel) => {
                return a.role - b.role;
              }
            );
            return {
              ...state,
              channelMembers: channelMembers,
            };
          case ChatsActionTypes.GET_CHANNEL_POSTS:
            return {
              ...state,
              getChannelPostsLoading: false,
              channelPosts: action.payload.data.post,
            };
          case ChatsActionTypes.GET_CHANNEL_HOMEWORKS:
            return {
              ...state,
              getChannelHomeworksLoading: false,
              channelHomeworks: action.payload.data.homework,
            };
          case ChatsActionTypes.GET_CHANNEL_ROLLCALLS:
            return {
              ...state,
              getChannelRollCallsLoading: false,
              channelRollCalls: action.payload.data.rollCall,
            };
          case ChatsActionTypes.TOGGLE_FAVOURITE_CONTACT:
            return {
              ...state,
              isFavouriteContactToggled: true,
            };
          case ChatsActionTypes.GET_ARCHIVE_CONTACT:
            return {
              ...state,
              archiveContacts: action.payload.data,
              isArchiveContactFetched: true,
              isContactArchiveToggled: false,
            };
          case ChatsActionTypes.TOGGLE_ARCHIVE_CONTACT:
            return {
              ...state,
              isContactArchiveToggled: true,
            };
          case ChatsActionTypes.DELETE_IMAGE:
            return {
              ...state,
              isImageDeleted: true,
            };
          case ChatsActionTypes.GET_POST_COMMENTS:
            return {
              ...state,
              getPostCommentsLoading: false,
              postComments: action.payload.data.comment,
            };
          case ChatsActionTypes.GET_ROLLCALL:
            return {
              ...state,
              rollCall: action.payload.data.rollCall,
            };
          case ChatsActionTypes.GET_HOMEWORK:
            return {
              ...state,
              homework: action.payload.data.homework,
            };
          case ChatsActionTypes.GET_CHANNEL_DIRS:
            return {
              ...state,
              channelDir: action.payload.data.fileNameArray,
              isDir: action.payload.data.isDirArray,
            };
          case ChatsActionTypes.GET_ALL_UPLOAD:
            return {
              ...state,
              homeworkUploads: action.payload.data.homeworkUpload,
            };
          case ChatsActionTypes.GET_ROLLCALL_RECORDS_BY_ID:
            return {
              ...state,
              rollCallRecords: action.payload.data.rollCallRecord,
            };
          case ChatsActionTypes.GET_MY_ROLLCALL_RECORD:
            return {
              ...state,
              myRollCallRecord: action.payload.data.rollCallRecord,
            };
          default:
            return { ...state };
        }

      case ChatsActionTypes.API_RESPONSE_ERROR:
        switch (action.payload.actionType) {
          case ChatsActionTypes.GET_FAVOURITES:
            return {
              ...state,
              isFavouritesFetched: false,
              getFavouritesLoading: false,
            };
          case ChatsActionTypes.GET_DIRECT_MESSAGES:
            return {
              ...state,
              isDirectMessagesFetched: false,
              getDirectMessagesLoading: false,
            };
          case ChatsActionTypes.ADD_CONTACTS:
            return {
              ...state,
              isContactsAdded: false,
              addContactsLoading: false,
            };
          case ChatsActionTypes.GET_CHAT_USER_DETAILS:
            return {
              ...state,
              isUserDetailsFetched: false,
              getUserDetailsLoading: false,
            };
          case ChatsActionTypes.GET_CHAT_USER_CONVERSATIONS:
            return {
              ...state,
              chatUserConversations: [],
              isUserConversationsFetched: false,
              getUserConversationsLoading: false,
              isUserMessageSent: false,
            };
          case ChatsActionTypes.GET_RECENT_CHAT:
            return { ...state };
          case ChatsActionTypes.ON_SEND_MESSAGE:
            return {
              ...state,
              isUserMessageSent: false,
            };
          case ChatsActionTypes.DELETE_MESSAGE:
            return {
              ...state,
              isMessageDeleted: false,
            };
          case ChatsActionTypes.FORWARD_MESSAGE:
            return {
              ...state,
              isMessageForwarded: false,
            };
          case ChatsActionTypes.DELETE_USER_MESSAGES:
            return {
              ...state,
              isUserMessagesDeleted: false,
            };
          case ChatsActionTypes.CREATE_CHANNEL:
            return {
              ...state,
              isChannelCreated: false,
              createChannelLoading: false,
            };
          case ChatsActionTypes.GET_CHANNELS:
            return {
              ...state,
              getChannelsError: action.payload.data,
              isChannelsFetched: false,
              getChannelsLoading: false,
            };
          case ChatsActionTypes.GET_CHANNEL_DETAILS:
            return {
              ...state,
              isChannelDetailsFetched: false,
              getUserDetailsLoading: false,
            };
          case ChatsActionTypes.TOGGLE_FAVOURITE_CONTACT:
            return {
              ...state,
              isFavouriteContactToggled: false,
            };
          case ChatsActionTypes.GET_ARCHIVE_CONTACT:
            return {
              ...state,
              isArchiveContactFetched: false,
            };
          case ChatsActionTypes.TOGGLE_ARCHIVE_CONTACT:
            return {
              ...state,
              isContactArchiveToggled: false,
            };
          case ChatsActionTypes.READ_CONVERSATION:
            return {
              ...state,
              isRead: false,
            };
          case ChatsActionTypes.DELETE_IMAGE:
            return {
              ...state,
              isImageDeleted: true,
            };
          case ChatsActionTypes.GET_ROLLCALL:
            return {
              ...state,
              rollCall: null,
            };
          case ChatsActionTypes.GET_HOMEWORK:
            return {
              ...state,
              homework: null,
            };
          case ChatsActionTypes.GET_CHANNEL_DIRS:
            return {
              ...state,
              channelDir: null,
              isDir: null,
            };
          default:
            return { ...state };
        }

      case ChatsActionTypes.WS_EVENT: {
        switch (action.payload.actionType) {
          case ChatsActionTypes.RECEIVE_MESSAGE:
            if (
              state.selectedChatInfo &&
              (state.selectedChatInfo.id === action.payload.data.SenderID ||
                state.selectedChatInfo.id === action.payload.data.ReceiverID)
            ) {
              state.chatUserConversations.push(action.payload.data);
            }
            var index = state.recentChatUsers
              ? state.recentChatUsers.findIndex(
                  record =>
                    (record.User1 === action.payload.data.SenderID ||
                      record.User2 === action.payload.data.SenderID) &&
                    (record.User1 === action.payload.data.ReceiverID ||
                      record.User2 === action.payload.data.ReceiverID)
                )
              : -1;
            if (index !== -1) {
              state.recentChatUsers[index].Messages[0] = action.payload.data;
            }
            return { ...state };
          case ChatsActionTypes.NEW_POST: {
            let wsData = action.payload.data;
            if (
              state.selectedChatInfo &&
              "founderID" in state.selectedChatInfo &&
              state.selectedChatInfo.id === wsData.channelID
            ) {
              let user = state.channelMembers.find(
                (user: channelMemberModel) => user.id === wsData.createUser
              );
              console.log(wsData.content);
              let postData: channelPostModel = {
                id: wsData.postID,
                user: user as userModel,
                content: wsData.content,
                deleted: false,
                timestamp: wsData.createTime,
                chennelID: wsData.chennelID,
                meetingID: wsData.meetingID,
              };
              state.channelPosts.push(postData);
            }
            return { ...state };
          }
          case ChatsActionTypes.NEW_COMMENT: {
            let wsData = action.payload.data;
            if (
              state.channelMembers &&
              state.selectedChatInfo &&
              "founderID" in state.selectedChatInfo &&
              state.selectedChatInfo.id === wsData.channelID
            ) {
              let user = state.channelMembers.find(
                (user: channelMemberModel) => user.id === wsData.createUser
              );
              let commentData: postCommentModel = {
                id: wsData.commentID,
                postID: wsData.postID,
                user: user as userModel,
                content: wsData.content,
                deleted: false,
                timestamp: wsData.createTime,
              };
              state.postComments.push(commentData);
            }
            return { ...state };
          }
          default:
            return { ...state };
        }
      }
      case ChatsActionTypes.GET_FAVOURITES: {
        return {
          ...state,
          getFavouritesLoading: true,
          isFavouritesFetched: false,
        };
      }
      case ChatsActionTypes.GET_DIRECT_MESSAGES:
        return {
          ...state,
          isDirectMessagesFetched: false,
          getDirectMessagesLoading: true,
        };
      case ChatsActionTypes.ADD_CONTACTS:
        return {
          ...state,
          isContactsAdded: false,
          addContactsLoading: true,
        };
      case ChatsActionTypes.CHANGE_SELECTED_CHAT:
        state.chatUserConversations = [];
        state.channelPosts = [];
        state.postComments = [];
        state.channelMembers = [];
        state.rollCall = undefined;
        state.channelRole = -1;
        return {
          ...state,
          selectedChat: action.payload.selectedChat,
          selectedChatInfo: action.payload.selectedChatInfo,
        };
      case ChatsActionTypes.CHANGE_SELECTED_HOMEWORK:
        state.homework = undefined;
        return {
          ...state,
          selectedHomework: action.payload.selectedHomework,
        };
      case ChatsActionTypes.CHANGE_SELECTED_ROLLCALL:
        state.selectedRollCall = null;
        return {
          ...state,
          selectedRollCall: action.payload.selectedRollCall,
        };
      case ChatsActionTypes.BACK_SELECTED_DIR:
        return {
          ...state,
          selectedDir: action.payload.selectedDir,
        };
      case ChatsActionTypes.CHANGE_SELECTED_DIR:
        return {
          ...state,
          selectedDir: action.payload.selectedDir,
        };
      case ChatsActionTypes.GET_CHAT_USER_DETAILS:
        return {
          ...state,
          isUserDetailsFetched: false,
          getUserDetailsLoading: true,
        };
      case ChatsActionTypes.GET_CHAT_USER_CONVERSATIONS:
        return {
          ...state,
          isUserConversationsFetched: false,
          getUserConversationsLoading: true,
          isUserMessageSent: false,
        };
      case ChatsActionTypes.TOGGLE_USER_DETAILS_TAB:
        return {
          ...state,
          isOpenUserDetails: action.payload,
        };
      case ChatsActionTypes.ON_SEND_MESSAGE:
        return {
          ...state,
          isUserMessageSent: false,
        };
      case ChatsActionTypes.DELETE_MESSAGE:
        return {
          ...state,
          isMessageDeleted: false,
        };
      case ChatsActionTypes.FORWARD_MESSAGE:
        return {
          ...state,
          isMessageForwarded: false,
        };
      case ChatsActionTypes.DELETE_USER_MESSAGES:
        return {
          ...state,
          isUserMessagesDeleted: false,
        };
      case ChatsActionTypes.CREATE_CHANNEL:
        return {
          ...state,
          isChannelCreated: false,
          createChannelLoading: true,
        };
      case ChatsActionTypes.GET_CHANNELS:
        return {
          ...state,
          isChannelsFetched: false,
          getChannelsLoading: true,
        };
      case ChatsActionTypes.GET_CHANNEL_DETAILS:
        return {
          ...state,
          isChannelDetailsFetched: false,
          getUserDetailsLoading: true,
        };
      case ChatsActionTypes.TOGGLE_FAVOURITE_CONTACT:
        return {
          ...state,
          isFavouriteContactToggled: false,
        };
      case ChatsActionTypes.GET_ARCHIVE_CONTACT:
        return {
          ...state,
          isArchiveContactFetched: false,
        };
      case ChatsActionTypes.TOGGLE_ARCHIVE_CONTACT:
        return {
          ...state,
          isContactArchiveToggled: false,
        };
      case ChatsActionTypes.DELETE_IMAGE:
        return {
          ...state,
          isImageDeleted: false,
        };
      case ChatsActionTypes.GET_CHANNEL_POSTS:
        return {
          ...state,
          getChannelPostsLoading: true,
        };
      case ChatsActionTypes.GET_CHANNEL_HOMEWORKS:
        return {
          ...state,
          getChannelHomeworksLoading: true,
        };
      case ChatsActionTypes.GET_CHANNEL_ROLLCALLS:
        return {
          ...state,
          getChannelRollCallsLoading: true,
        };
      case ChatsActionTypes.GET_POST_COMMENTS:
        return {
          ...state,
          getPostCommentsLoading: true,
        };
      default:
        return { ...state };
    }
  }
);

export default Chats;
