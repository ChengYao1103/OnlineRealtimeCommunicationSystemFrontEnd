// costants
import { TABS } from "../../constants/index";

export interface MenuItemType {
  id: number;
  key: string;
  icon: string;
  tooltipTitle: string;
  className?: string;
  tabId: // | TABS.BOOKMARK
  // | TABS.CALLS
  // | TABS.CONTACTS
  TABS.CHAT | TABS.SETTINGS | TABS.USERS;
}
const MENU_ITEMS: MenuItemType[] = [
  {
    id: 1,
    key: "pills-user-tab",
    icon: "bx bx-user-circle",
    tooltipTitle: "個人資料",
    className: "d-none d-lg-block",
    tabId: TABS.USERS,
  },
  {
    id: 2,
    key: "pills-chat-tab",
    icon: "bx bx-conversation",
    tooltipTitle: "聊天",
    tabId: TABS.CHAT,
  },
  // {
  //   id: 3,
  //   key: "pills-contacts-tab",
  //   icon: "bx bxs-user-detail",
  //   tooltipTitle: "聯絡人",
  //   tabId: TABS.CONTACTS,
  // },
  // {
  //   id: 4,
  //   key: "pills-calls-tab",
  //   icon: "bx bx-phone-call",
  //   tooltipTitle: "通話紀錄",
  //   tabId: TABS.CALLS,
  // },
  // {
  //   id: 5,
  //   key: "pills-bookmark-tab",
  //   icon: "bx bx-bookmarks",
  //   tooltipTitle: "書籤",
  //   tabId: TABS.BOOKMARK,
  // },
  {
    id: 6,
    key: "pills-setting-tab",
    icon: "bx bx-cog",
    tooltipTitle: "個人資料設定",
    tabId: TABS.SETTINGS,
  },
];

export { MENU_ITEMS };
