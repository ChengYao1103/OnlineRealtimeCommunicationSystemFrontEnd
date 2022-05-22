import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";

// interface
import { ChannelTypes } from "../../../data/chat";
import { channelModel } from "../../../redux/chats/types";

interface ChannelProps {
  channel: channelModel;
  selectedChat: string | number;
  onSelectChat: (
    id: number | string,
    info: channelModel,
    isChannel?: boolean
  ) => void;
}
const ChatChannel = ({ channel, selectedChat, onSelectChat }: ChannelProps) => {
  //const unRead = channel.meta && channel.meta.unRead;
  const unRead = false;
  const isSelectedChat: boolean =
    selectedChat && selectedChat === channel.id ? true : false;
  const onClick = () => {
    onSelectChat(channel.id, channel, true);
  };

  return (
    <li className={classnames({ active: isSelectedChat })} onClick={onClick}>
      <Link to="#" className={classnames({ "unread-msg-user": unRead })}>
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0 avatar-xs me-2">
            <span className="avatar-title rounded-circle bg-soft-light text-dark">
              #
            </span>
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <p className="text-truncate mb-0">{channel.name}</p>
          </div>
          {unRead && unRead !== 0 ? (
            <div className="flex-shrink-0 ms-2">
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

export default ChatChannel;
