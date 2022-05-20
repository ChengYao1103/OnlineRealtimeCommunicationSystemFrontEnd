import React, { useState } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";

// hooks
import { useRedux } from "../../../hooks/index";

// interface
import { UserTypes } from "../../../data/chat";
import { STATUS_TYPES } from "../../../constants";
import { recentChatUserTypes } from "../../../redux/chats/types";

//actions
import { getUserInformation } from "../../../redux/actions";

interface ChatUserProps {
  user: recentChatUserTypes;
  selectedChat: string | number;
  onSelectChat: (id: number | string) => void;
}

const ChatUser = ({ user, selectedChat, onSelectChat }: ChatUserProps) => {
  const { dispatch, useAppSelector } = useRedux();
  const [isload, setIsLoad] = useState<boolean>(false);
  /* -------------多筆資料可能會錯亂？------------- */
  if (!isload) {
    setIsLoad(true);
    dispatch(getUserInformation(user.User2.toString()));
  }
  const { userInfo } = useAppSelector(state => ({
    userInfo: state.Auth.otherUserInfo,
  }));
  /* -------------多筆資料可能會錯亂？------------- */
  const fullName = userInfo ? userInfo.name : "";

  const colors = [
    "bg-primary",
    "bg-danger",
    "bg-info",
    "bg-warning",
    "bg-secondary",
    "bg-pink",
    "bg-purple",
  ];
  const [color] = useState(Math.floor(Math.random() * colors.length));
  //const isOnline = user.status && user.status === STATUS_TYPES.ACTIVE;
  //const unRead = user.meta && user.meta.unRead;
  const isOnline = STATUS_TYPES.ACTIVE;
  const unRead = 0;

  const isSelectedChat: boolean =
    selectedChat && selectedChat === userInfo.id ? true : false;
  const onClick = () => {
    onSelectChat(userInfo.id);
  };
  return (
    <li className={classnames({ active: isSelectedChat })} onClick={onClick}>
      <Link to="#" className={classnames({ "unread-msg-user": unRead })}>
        <div className="d-flex align-items-center">
          <div
            className={classnames(
              "chat-user-img",
              "align-self-center",
              "me-2",
              "ms-0",
              { online: isOnline }
            )}
          >
            {userInfo && userInfo.photo ? (
              <>
                <img
                  src={userInfo.photo}
                  className="rounded-circle avatar-xs"
                  alt=""
                />
                {isOnline && <span className="user-status"></span>}
              </>
            ) : (
              <div className="avatar-xs">
                <span
                  className={classnames(
                    "avatar-title",
                    "rounded-circle",
                    "text-uppercase",
                    "text-white",
                    colors[color]
                  )}
                >
                  <span className="username">{fullName.substring(0, 1)}</span>
                  <span className="user-status"></span>
                </span>
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-truncate mb-0">{fullName}</p>
          </div>
          {unRead && unRead !== 0 ? (
            <div className="ms-auto">
              <span className="badge badge-soft-dark rounded p-1">
                {unRead}
              </span>
            </div>
          ) : null}
        </div>
      </Link>
    </li>
  );
};

export default ChatUser;
