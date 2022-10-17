import React, { useState, useEffect } from "react";
import classnames from "classnames";

// hooks
import { useRedux } from "../../../hooks/index";

// actions
import {
  toggleUserDetailsTab,
  toggleFavouriteContact,
  getChatUserDetails,
  toggleArchiveContact,
} from "../../../redux/actions";

// components
import AudioCallModal from "../../../components/AudioCallModal";
import VideoCallModal from "../../../components/VideoCallModal";
import AppSimpleBar from "../../../components/AppSimpleBar";
import Loader from "../../../components/Loader";
import ProfileUser from "./ProfileUser";
import Actions from "./Actions";
import BasicDetails from "./BasicDetails";
import Groups from "./Groups";
import Media from "../../../components/Media";
import AttachedFiles from "../../../components/AttachedFiles";
import Status from "./Status";
import Members from "./Members";
import ProfileChannel from "./ProfileChannel";
import ChannelMeetingModal from "../../../components/ChannelMeetingModal";
import InviteChannelModal from "../../../components/InviteChannelModal";
import RollCallModal from "../../../components/RollCallModal";

interface IndexProps {
  isChannel: boolean;
}
const Index = ({ isChannel }: IndexProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  const {
    selectedChatInfo, // 用途可能跟chatUserDetails重複
    chatUserDetails,
    getUserDetailsLoading,
    isOpenUserDetails,
    isFavouriteContactToggled,
    channelRole,
  } = useAppSelector(state => ({
    selectedChatInfo: state.Chats.selectedChatInfo,
    chatUserDetails: state.Chats.chatUserDetails,
    getUserDetailsLoading: state.Chats.getUserDetailsLoading,
    isOpenUserDetails: state.Chats.isOpenUserDetails,
    isFavouriteContactToggled: state.Chats.isFavouriteContactToggled,
    channelRole: state.Chats.channelRole,
  }));

  useEffect(() => {
    if (isFavouriteContactToggled) {
      dispatch(getChatUserDetails(chatUserDetails.id));
    }
  }, [dispatch, isFavouriteContactToggled, chatUserDetails.id]);

  /*
  close tab
  */
  const onCloseUserDetails = () => {
    dispatch(toggleUserDetailsTab(false));
  };

  /*
  video call modal
  */
  const [isOpenVideoModal, setIsOpenVideoModal] = useState<boolean>(false);
  const onOpenVideo = () => {
    setIsOpenVideoModal(true);
  };
  const onCloseVideo = () => {
    setIsOpenVideoModal(false);
  };

  /*
  audio call modal
  */
  const [isOpenAudioModal, setIsOpenAudioModal] = useState<boolean>(false);
  const onOpenAudio = () => {
    setIsOpenAudioModal(true);
  };
  const onCloseAudio = () => {
    setIsOpenAudioModal(false);
  };

  /*
  invite user modal
  */
  const [isOpenInviteModal, setIsOpenInviteModal] = useState<boolean>(false);
  const onOpenInvite = () => {
    setIsOpenInviteModal(true);
  };
  const onCloseInvite = () => {
    setIsOpenInviteModal(false);
  };

  /*
  roll call modal
  */
  const [isOpenRollCallModal, setIsOpenRollCallModal] =
    useState<boolean>(false);
  const onOpenRollCall = () => {
    setIsOpenRollCallModal(true);
  };
  const onCloseRollCall = () => {
    setIsOpenRollCallModal(false);
  };

  /*
  favourite
  */
  const onToggleFavourite = () => {
    dispatch(toggleFavouriteContact(chatUserDetails.id));
  };

  /*
  archive
  */
  const onToggleArchive = () => {
    dispatch(toggleArchiveContact(chatUserDetails.id));
  };

  return (
    <>
      <div
        className={classnames("user-profile-sidebar", {
          "d-block": isOpenUserDetails,
        })}
      >
        <div className="position-relative">
          {getUserDetailsLoading && <Loader />}

          {!isChannel ? (
            <ProfileUser
              onCloseUserDetails={onCloseUserDetails}
              selectedChatInfo={selectedChatInfo}
              onOpenVideo={onOpenVideo}
              onOpenAudio={onOpenAudio}
            />
          ) : (
            <ProfileChannel
              onCloseUserDetails={onCloseUserDetails}
              selectedChatInfo={selectedChatInfo}
              onOpenInvite={onOpenInvite}
              onOpenRollCall={onOpenRollCall}
            />
          )}
          {/* <!-- End profile user --> */}

          {/* <!-- Start user-profile-desc --> */}
          <AppSimpleBar className="p-4 user-profile-desc">
            {" "}
            {/* simplebar */}
            {/* <Actions
              chatUserDetails={chatUserDetails}
              onOpenVideo={onOpenVideo}
              onOpenAudio={onOpenAudio}
              onToggleFavourite={onToggleFavourite}
              onToggleArchive={onToggleArchive}
            /> */}
            {/*<Status about={chatUserDetails.about} />*/}
            {!isChannel ? (
              <>
                <BasicDetails selectedChatInfo={selectedChatInfo} />
                <hr className="my-4" />
                <Groups selectedChatInfo={selectedChatInfo} />
                <hr className="my-4" />
              </>
            ) : (
              <>
                <Members selectedChatInfo={selectedChatInfo} />
                <hr className="my-4" />
              </>
            )}
            <Media media={chatUserDetails.media} limit={3} />
            <hr className="my-4" />
            <AttachedFiles attachedFiles={chatUserDetails.attachedFiles} />
          </AppSimpleBar>
          {/* <!-- end user-profile-desc --> */}
          {isOpenAudioModal && (
            <AudioCallModal
              isBeenCalled={false}
              isOpen={isOpenAudioModal}
              onClose={onCloseAudio}
              callInfo={chatUserDetails}
              user={selectedChatInfo}
            />
          )}
          {isOpenVideoModal && (
            <VideoCallModal
              isBeenCalled={false}
              isOpen={isOpenVideoModal}
              onClose={onCloseVideo}
              callInfo={chatUserDetails}
              user={selectedChatInfo}
            />
          )}
          {isOpenInviteModal && (
            <InviteChannelModal
              isOpen={isOpenInviteModal}
              onClose={onCloseInvite}
            />
          )}

          {isOpenRollCallModal && (
            <RollCallModal
              isOpen={isOpenRollCallModal}
              onClose={onCloseRollCall}
              role={channelRole}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
