import React, { useEffect, useState } from "react";
import classnames from "classnames";

// hooks
import { useRedux } from "../../hooks/index";

// hooks
import { useConversationUserType } from "../../hooks/index";

// component
import Leftbar from "./Leftbar";
import ConversationUser from "./ConversationUser/index";
import UserProfileDetails from "./UserProfileDetails/index";
import Welcome from "./ConversationUser/Welcome";
import WSEventHandler from "../../api/wsEventHandler";
import VideoCallModal from "../../components/VideoCallModal";
import AudioCallModal from "../../components/AudioCallModal";

interface IndexProps {}
const Index = (props: IndexProps) => {
  const [isOpenAudioModal, setIsOpenAudioModal] = useState<boolean>(false);
  // global store
  const { useAppSelector } = useRedux();

  const { selectedChat, onCalling, callingUserInfo } = useAppSelector(
    state => ({
      selectedChat: state.Chats.selectedChat,
      onCalling: state.Calls.onCalling,
      callingUserInfo: state.Auth.otherUserInfo,
    })
  );

  const { isChannel } = useConversationUserType();

  useEffect(() => {
    if (onCalling && callingUserInfo) {
      setIsOpenAudioModal(true);
    } else {
      setIsOpenAudioModal(false);
    }
  }, [onCalling]);

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
        {selectedChat !== null ? (
          <div className="chat-content d-lg-flex">
            <div className="w-100 overflow-hidden position-relative">
              <ConversationUser isChannel={isChannel} />
            </div>
            <UserProfileDetails isChannel={isChannel} />
          </div>
        ) : (
          <Welcome />
        )}
        {isOpenAudioModal && (
          <AudioCallModal
            isBeenCalled={onCalling}
            isOpen={isOpenAudioModal}
            onClose={() => {
              setIsOpenAudioModal(false);
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
