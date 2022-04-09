import React from "react";
import { UncontrolledTooltip } from "reactstrap";

// interface
import { ChannelTypes } from "../../../data/chat";
import { Channel } from "../../../redux/chats/types";

// components
import AddButton from "../../../components/AddButton";
import ChatChannel from "./ChatChannel";

interface ChanelsProps {
  channels: Array<Channel>;
  openCreateChannel: () => void;
  selectedChat: string | number;
  onSelectChat: (id: number | string, isChannel?: boolean) => void;
}
const Chanels = ({
  channels,
  openCreateChannel,
  selectedChat,
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
          {/*channels
            ? channels.forEach(channel => {
                <ChatChannel
                  channel={channel}
                  key={key}
                  selectedChat={selectedChat}
                  onSelectChat={onSelectChat}
                />;
              })
            : null*/}
          {/*(channels || []).map((channel: Channel, key: number) => (
            <ChatChannel
              channel={channel}
              key={key}
              selectedChat={selectedChat}
              onSelectChat={onSelectChat}
            />
          ))*/}
        </ul>
      </div>
    </>
  );
};

export default Chanels;
