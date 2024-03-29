import React, { useEffect, useState } from "react";
import { UncontrolledTooltip } from "reactstrap";
import { useRedux } from "../../../hooks/index";

//components
import AddButton from "../../../components/AddButton";
import ChatUser from "./ChatUser";
import Loader from "../../../components/Loader";

// interface
import { UserTypes } from "../../../data/chat";
import {
  clearOtherUserInformation,
  getRecentChat,
} from "../../../redux/actions";
import { userModel } from "../../../redux/auth/types";
import { recentChatUserModel } from "../../../redux/chats/types";

// actions
import { getUserInformation } from "../../../redux/actions";

interface DirectMessagesProps {
  authUser: userModel;
  recentChatArray: Array<recentChatUserModel>;
  openAddContact: () => void;
  selectedChatInfo: userModel;
  onSelectChat: (id: number | string, user: userModel) => void;
}
const DirectMessages = ({
  authUser,
  recentChatArray,
  openAddContact,
  selectedChatInfo,
  onSelectChat,
}: DirectMessagesProps) => {
  const { dispatch, useAppSelector } = useRedux();
  const [isLoadInformation, setIsLoadInformation] = useState<boolean>(false);
  const { otherUserInfoState } = useAppSelector(state => ({
    otherUserInfoState: state.Auth.otherUserInfo,
  }));
  const [chatUsers, setChatUsers] = useState<Array<userModel>>([]);

  useEffect(() => {
    let targetId = 0;
    if (!isLoadInformation && recentChatArray && recentChatArray.length > 0) {
      setIsLoadInformation(true);
      recentChatArray.forEach(element => {
        // 辨認是否為他人id
        targetId =
          element.User1 === authUser.id ? element.User2 : element.User1;
        dispatch(getUserInformation(targetId.toString()));
      });
      dispatch(clearOtherUserInformation()); // handle duplicate
    }
  }, [
    dispatch,
    isLoadInformation,
    authUser,
    recentChatArray,
    otherUserInfoState,
  ]);

  useEffect(() => {
    let tmpChatUsers: Array<userModel> = [];
    chatUsers.forEach(user => {
      tmpChatUsers.push(user);
    });
    if (
      isLoadInformation &&
      otherUserInfoState &&
      tmpChatUsers.findIndex(
        element => element.id === otherUserInfoState.id
      ) === -1
    ) {
      tmpChatUsers.push(otherUserInfoState);
      setChatUsers(tmpChatUsers);
    }
  }, [isLoadInformation, otherUserInfoState, recentChatArray]);

  useEffect(() => {
    if (recentChatArray.length > 0) {
      setIsLoadInformation(false);
    }
  }, [recentChatArray]);

  /*
    add contacts
    */
  return (
    <>
      <div className="d-flex align-items-center px-4 mt-5 mb-2">
        <div className="flex-grow-1">
          <h4 className="mb-0 font-size-11 text-muted text-uppercase">
            私人訊息
          </h4>
        </div>
        {/* Refresh Recent Chat list */}
        <div className="flex-shrink-0">
          <div id="refresh-message">
            <button
              type="button"
              onClick={() => {
                dispatch(getRecentChat(10, 1));
                setIsLoadInformation(false);
                setChatUsers([]);
              }}
              className="btn btn-soft-primary btn-sm"
            >
              <i className="bx bx-loader"></i>
            </button>
          </div>
          <UncontrolledTooltip target="refresh-message" placement="bottom">
            重新整理
          </UncontrolledTooltip>
        </div>
        {/* Start a new message */}
        <div className="flex-shrink-0">
          <div id="new-message">
            {/* Button trigger modal */}
            <AddButton onClick={openAddContact} /> {/* contactModal */}
          </div>
          <UncontrolledTooltip target="new-message" placement="bottom">
            傳送新訊息
          </UncontrolledTooltip>
        </div>
      </div>

      <div className="chat-message-list">
        <ul className="list-unstyled chat-list chat-user-list">
          {chatUsers.length === recentChatArray.length ? (
            chatUsers.map((user: userModel) => (
              <ChatUser
                user={user}
                key={user.id}
                selectedChatInfo={selectedChatInfo}
                onSelectChat={onSelectChat}
              />
            ))
          ) : (
            <div className="position-relative" style={{ height: "100%" }}>
              <Loader />
            </div>
          )}
        </ul>
      </div>
    </>
  );
};

export default DirectMessages;
