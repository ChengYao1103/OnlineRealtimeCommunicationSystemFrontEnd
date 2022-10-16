//auth
export const POST_FAKE_LOGIN = "/post-fake-login";
export const POST_JWT_LOGIN = "/user/login";
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";
export const JWT_REGISTER = "/user/register";
export const POST_FAKE_REGISTER = "/post-fake-register";
export const GET_AUTH_INFOMATION = "/user/information";
export const GET_USERID_BY_EMAIL = "/user/getID";

// profile & settings
export const USER_CHANGE_PASSWORD = "/user/changePassword";
export const USER_CHANGE_INFOMATION = "/user/changeInformation";
export const GET_PROFILE_DETAILS = "/profile-details";
export const GET_USER_SETTINGS = "/user-settings";
export const UPDATE_ETTINGS = "/update-user-settings";

// contacts
export const GET_CONTACTS = "/user-contacts";
export const INVITE_CONTACT = "/invite-contact";

// calls
export const GET_CALLS_LIST = "/calls-list";

// bookmarks
export const GET_BOOKMARKS_LIST = "/bookmarks-list";
export const DELETE_BOOKMARK = "/bookmarks-delete";
export const UPDATE_BOOKMARK = "/bookmarks-update";

// chats
export const SEND_MESSAGE = "/message/send";
export const GET_RECENT_CHAT = "/message/recentChat";
export const GET_CHAT_USER_CONVERSATIONS = "/message/record";
export const GET_FAVOURITES = "/get-favourites";
export const GET_DIRECT_MESSAGES = "/get-direct-messages";
export const ADD_CONTACTS = "/add-contact";
export const GET_CHAT_USER_DETAILS = "/get-user-details";
export const RECEIVE_MESSAGE = "/receive-message";
export const READ_MESSAGE = "/read-message";
export const RECEIVE_MESSAGE_FROM_USER = "/receive-message-from-user";
export const DELETE_MESSAGE = "/delete-message";
export const FORWARD_MESSAGE = "/forward-message";
export const DELETE_USER_MESSAGES = "/delete-user-messages";
export const TOGGLE_FAVOURITE_CONTACT = "/toggle-favourite-contact";
export const GET_ARCHIVE_CONTACT = "/get-archive-contacts";
export const TOGGLE_ARCHIVE_CONTACT = "/toggle-archive-contact";
export const READ_CONVERSATION = "/read-conversation";
export const DELETE_IMAGE = "/user-delete-img";
export const UPLOAD_MESSAGE_FILE = "/message/upload";
export const DOWNLOAD_MESSAGE_FILE = "/message/download";

// channels
export const GET_CHANNELS = "/user/allChannel";
export const GET_ROLE = "/channel/getRole";
export const CREATE_CHANNEL = "/channel/create";
export const GET_CHANNEL_DETAILS = "/channel";
export const GET_CHANNEL_MEMBERS = "/channel/allUser";
export const INVITE_CHANNEL_MEMBERS = "/channel/invite";
export const GET_CHANNEL_POSTS = "/channel/allPost";
export const GET_ROLLCALL = "/channel/getRollCall";
export const KICK_OUT = "/channel/kickOut";
export const GET_CHANNEL_HOMEWORKS = "/channel/allHomework";
export const CREATE_CHANNEL_DIRS = "/channel/createDir";
export const GET_CHANNEL_DIRS = "/channel/allDir";
export const UPLOAD_CHANNEL_FILE = "/channel/upload";
export const DOWNLOAD_CHANNEL_FILE = "/channel/download";
export const GET_CHANNEL_ROLLCALLS = "/channel/allRollCall";

// posts
export const CREATE_POST = "/post/create";
export const CREATE_COMMENT = "/post/comment";
export const DELETE_POST = "/post/delete";
export const DELETE_COMMENT = "/post/deleteComment";
export const GET_POST_COMMENTS = "/post/allComment";

// roll calls
export const CREATE_ROLLCALL = "/rollCall/create";
export const DO_ROLLCALL = "/rollCall/do";
export const CLOSE_ROLLCALL = "/rollCall/close";
export const UPDATE_ROLLCALL = "/rollCall/update";
export const GET_ROLLCALL_RECORDS = "/rollCall/record";
export const GET_MY_ROLLCALL_RECORD = "/rollCall/myRecord";

//homework
export const CREATE_HOMEWORK = "/homework/create";
export const UPDATE_HOMEWORK = "/homework/update";
export const CLOSE_HOMEWORK = "/homework/close";
export const UPLOAD_HOMEWORK = "/homework/upload";
export const DOWNLOAD_HOMEWORK = "/homework/download";
export const SET_HOMEWORK_SCORE = "/homework/setScore";
export const GET_HOMEWORK = "/homework";
export const GET_ALL_UPLOAD = "/homework/allUpload"