import React from "react";

// component
import ChatUser from "./ChatUser";
import ChatChannel from "./ChatChannel";
import { userModel } from "../../../redux/auth/types";
import { channelModel } from "../../../redux/chats/types";

interface ArchiveProps {
  archiveContacts: any;
  selectedChatInfo: any;
  onSelectChat: (id: number | string, info: userModel | channelModel) => void;
}
const Archive = ({
  archiveContacts,
  selectedChatInfo,
  onSelectChat,
}: ArchiveProps) => {
  return (
    <>
      <h5 className="mb-3 px-4 mt-4 font-size-11 text-muted text-uppercase">
        Archived
      </h5>

      <div className="chat-message-list">
        <ul className="list-unstyled chat-list chat-user-list">
          {(archiveContacts || []).map((chat: any, key: number) => {
            if (chat.isChannel) {
              return (
                <ChatChannel
                  channel={chat}
                  key={key}
                  selectedChatInfo={selectedChatInfo}
                  onSelectChat={onSelectChat}
                />
              );
            } else {
              return (
                <ChatUser
                  user={chat}
                  key={key}
                  selectedChatInfo={selectedChatInfo}
                  onSelectChat={onSelectChat}
                />
              );
            }
          })}
        </ul>
      </div>
    </>
  );
};

export default Archive;
