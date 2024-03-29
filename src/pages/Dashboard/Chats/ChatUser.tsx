import React, { useState } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";

// interface
import { STATUS_TYPES } from "../../../constants";
import { userModel } from "../../../redux/auth/types";

interface ChatUserProps {
  user: userModel;
  selectedChatInfo: userModel;
  onSelectChat: (id: number | string, user: userModel) => void;
}

const ChatUser = ({ user, selectedChatInfo, onSelectChat }: ChatUserProps) => {
  const fullName = user.name;

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
  const isOnline = false;
  const unRead = 0;

  const isSelectedChat: boolean =
    selectedChatInfo &&
    selectedChatInfo.id === user.id &&
    selectedChatInfo.name === user.name;
  const onClick = () => {
    onSelectChat(user.id, user);
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
            {user.photo ? (
              <>
                <img
                  src={user.photo}
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
                  {isOnline && <span className="user-status"></span>}
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
