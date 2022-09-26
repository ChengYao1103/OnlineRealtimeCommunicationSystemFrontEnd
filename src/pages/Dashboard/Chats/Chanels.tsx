import React from "react";
import { UncontrolledTooltip } from "reactstrap";

// interface
import { ChannelTypes } from "../../../data/chat";
import { channelModel } from "../../../redux/chats/types";

// components
import AddButton from "../../../components/AddButton";
import ChatChannel from "./ChatChannel";

interface ChanelsProps {
  channels: Array<channelModel>;
  openCreateChannel: () => void;
  selectedChatInfo: channelModel;
  onSelectChat: (
    id: number | string,
    info: channelModel,
    isChannel?: boolean
  ) => void;
}
const Chanels = ({
  channels,
  openCreateChannel,
  selectedChatInfo,
  onSelectChat,
}: ChanelsProps) => {
  return (
    <>
      <div className="d-flex align-items-center px-4 mt-5 mb-2">
        <div className="flex-grow-1">
          <h4 className="mb-0 font-size-11 text-muted text-uppercase">
            Channels
          </h4>
        </div>
        <div className="flex-shrink-0">
          <div id="create-group">
            {/* Button trigger modal */}
            <AddButton onClick={openCreateChannel} />{" "}
            {/* addgroup-exampleModal */}
          </div>
          <UncontrolledTooltip target="create-group" placement="bottom">
            Create group
          </UncontrolledTooltip>
        </div>
      </div>

      <div className="chat-message-list">
        <ul className="list-unstyled chat-list chat-user-list mb-3">
          {(channels || []).map((channel: channelModel, key: number) => (
            <ChatChannel
              channel={channel}
              key={channel.id}
              selectedChatInfo={selectedChatInfo}
              onSelectChat={onSelectChat}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default Chanels;
