// constants
import { TABS, LAYOUT_MODES } from "../../constants/index";

export enum LayoutActionTypes {
  CHANGE_TAB = "@@layout/CHANGE_TAB",
  CHANGE_LAYOUT_MODE = "@@layout/CHANGE_LAYOUT_MODE",
}
export interface LayoutState {
  layoutMode: LAYOUT_MODES.LIGHT | LAYOUT_MODES.DARK;
  activeTab: // | TABS.BOOKMARK
  // | TABS.CALLS
  // | TABS.CONTACTS
  TABS.CHAT | TABS.SETTINGS | TABS.USERS;
}
