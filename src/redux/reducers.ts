import { combineReducers } from "redux";

import Auth from "./auth/reducer";
import Layout from "./layout/reducer";
import Profile from "./profile/reducer";
import Contacts from "./contacts/reducer";
import Calls from "./calls/reducer";
import Bookmarks from "./bookmarks/reducer";
import Settings from "./settings/reducer";
import Chats from "./chats/reducer";

export default combineReducers({
  Auth,
  Layout,
  Profile,
  Contacts,
  Calls,
  Bookmarks,
  Settings,
  Chats,
});
