import React, { useEffect, useState } from "react";
import { UncontrolledTooltip } from "reactstrap";
import { useRedux } from "../../../hooks/index";

//components
import AddButton from "../../../components/AddButton";
import ChatUser from "./ChatUser";

// interface
import { UserTypes } from "../../../data/chat";
import { getRecentChat } from "../../../redux/actions";
import { userModel } from "../../../redux/auth/types";
import { recentChatUserTypes } from "../../../redux/chats/types";

// actions
import { getUserInformation } from "../../../redux/actions";

interface DirectMessagesProps {
  authUser: userModel;
  recentChatArray: Array<recentChatUserTypes>;
  openAddContact: () => void;
  selectedChat: string | number;
  onSelectChat: (id: number | string) => void;
}
const DirectMessages = ({
  authUser,
  recentChatArray,
  openAddContact,
  selectedChat,
  onSelectChat,
}: DirectMessagesProps) => {
  const { dispatch, useAppSelector } = useRedux();
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const { userInfoState } = useAppSelector(state => ({
    userInfoState: state.Auth.otherUserInfo,
  }));
  const chatUsers: Array<userModel> = [];

  useEffect(() => {
    let targetId = 0;
    if (!isLoad && recentChatArray) {
      setIsLoad(true);
      recentChatArray.forEach(element => {
        // 辨認是否為他人id
        targetId =
          element.User1 === authUser.id ? element.User2 : element.User1;
        dispatch(getUserInformation(targetId.toString()));
      });
    }
  }, [dispatch, isLoad, authUser, recentChatArray, userInfoState]);
  if (
    isLoad &&
    userInfoState &&
    chatUsers.findIndex(element => element === userInfoState) === -1
  ) {
    chatUsers.push(userInfoState);
    //setChatUserArray(test);
  }

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
          {chatUsers.map((user: userModel) => (
            <ChatUser
              user={user}
              key={user.id}
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
