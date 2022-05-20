import React from "react";
import { UncontrolledTooltip } from "reactstrap";
import { useRedux } from "../../../hooks/index";

//components
import AddButton from "../../../components/AddButton";

// interface
import { UserTypes } from "../../../data/chat";
import { getRecentChat } from "../../../redux/actions";
import { userModel } from "../../../redux/auth/types";
import { recentChatUserTypes } from "../../../redux/chats/types";

// component
import ChatUser from "./ChatUser";

interface DirectMessagesProps {
  authUser: userModel;
  recentChatArray: Array<recentChatUserTypes>;
  openAddContact: () => void;
  selectedChat: string | number;
  onSelectChat: (id: number | string) => void;
}
const DirectMessages = ({
  authUser,
  recentChatArray: users,
  openAddContact,
  selectedChat,
  onSelectChat,
}: DirectMessagesProps) => {
  const { dispatch } = useRedux();
  /*
    add contacts
    */
  return (
    <>
      <div className="d-flex align-items-center px-4 mt-5 mb-2">
        <div className="flex-grow-1">
          <h4 className="mb-0 font-size-11 text-muted text-uppercase">
            Direct Messages
          </h4>
        </div>
        {/* Refresh Recent Chat list */}
        <div className="flex-shrink-0">
          <div id="refresh-message">
            <button
              type="button"
              onClick={() => {
                dispatch(getRecentChat(10, authUser.id));
              }}
              className="btn btn-soft-primary btn-sm"
            >
              <i className="bx bx-chat"></i>
            </button>
          </div>
          <UncontrolledTooltip target="refresh-message" placement="bottom">
            Refresh Message
          </UncontrolledTooltip>
        </div>
        {/* Start a new message */}
        <div className="flex-shrink-0">
          <div id="new-message">
            {/* Button trigger modal */}
            <AddButton onClick={openAddContact} /> {/* contactModal */}
          </div>
          <UncontrolledTooltip target="new-message" placement="bottom">
            New Message
          </UncontrolledTooltip>
        </div>
      </div>

      <div className="chat-message-list">
        <ul className="list-unstyled chat-list chat-user-list">
          {(users || []).map((user: recentChatUserTypes, key: number) => (
            <ChatUser
              user={user}
              key={key}
              selectedChat={selectedChat}
              onSelectChat={onSelectChat}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default DirectMessages;
