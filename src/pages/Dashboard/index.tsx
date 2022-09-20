import React, { useEffect, useState } from "react";
import classnames from "classnames";

// hooks
import { useRedux } from "../../hooks/index";

// hooks
import { useConversationUserType } from "../../hooks/index";

// component
import Leftbar from "./Leftbar";
import ConversationUser from "./Conversation/User/index";
import UserProfileDetails from "./UserProfileDetails/index";
import Welcome from "./Conversation/Welcome";
import WSEventHandler from "../../api/wsEventHandler";
import VideoCallModal from "../../components/VideoCallModal";
import AudioCallModal from "../../components/AudioCallModal";
import { WSConnection } from "../../api/webSocket";
import ConversationChannel from "./Conversation/Channel";

interface IndexProps {}
const Index = (props: IndexProps) => {
  const [isOpenAudioModal, setIsOpenAudioModal] = useState<boolean>(false);
  const [isOpenVideoModal, setIsOpenVideoModal] = useState<boolean>(false);
  // global store
  const { useAppSelector } = useRedux();

  const { selectedChat, selectedChatInfo, onCallingType, callingUserInfo } =
    useAppSelector(state => ({
      selectedChat: state.Chats.selectedChat,
      selectedChatInfo: state.Chats.selectedChatInfo,
      onCallingType: state.Calls.onCallingType,
      callingUserInfo: state.Calls.callingUserInfo,
    }));

  const { isChannel } = useConversationUserType();

  useEffect(() => {
    if (callingUserInfo && onCallingType !== "") {
      switch (onCallingType) {
        case "audio": {
          setIsOpenAudioModal(true);
          break;
        }
        case "video": {
          setIsOpenVideoModal(true);
          break;
        }
        default: {
          break;
        }
      }
    }
  }, [onCallingType, callingUserInfo]);

  return (
    <>
      <WSEventHandler />
      <Leftbar />

      <div
        className={classnames("user-chat", "w-100", "overflow-hidden", {
          "user-chat-show": selectedChat,
        })}
        id="user-chat"
      >
        <div className="user-chat-overlay" id="user-chat-overlay"></div>
        {selectedChatInfo !== undefined ? (
          selectedChatInfo.founderID ? (
            <div className="chat-content d-lg-flex">
              <div className="w-100 overflow-hidden position-relative">
                <ConversationChannel />
              </div>
              <UserProfileDetails isChannel={true} />
            </div>
          ) : (
            <div className="chat-content d-lg-flex">
              <div className="w-100 overflow-hidden position-relative">
                <ConversationUser />
              </div>
              <UserProfileDetails isChannel={false} />
            </div>
          )
        ) : (
          <Welcome />
        )}
        {/* Receive Audio call */}
        {isOpenAudioModal && (
          <AudioCallModal
            isBeenCalled={true}
            isOpen={isOpenAudioModal}
            onClose={() => {
              setIsOpenAudioModal(false);
            }}
            callInfo={callingUserInfo}
            user={callingUserInfo}
          />
        )}
        {/* Receive Video call */}
        {isOpenVideoModal && (
          <VideoCallModal
            isBeenCalled={true}
            isOpen={isOpenVideoModal}
            onClose={() => {
              setIsOpenVideoModal(false);
            }}
            callInfo={callingUserInfo}
            user={callingUserInfo}
          />
        )}
      </div>
    </>
  );
};

export default Index;
