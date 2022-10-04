import React, { useState } from "react";
import {
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Button,
  Alert,
  UncontrolledTooltip,
} from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";

// hooks
import { useRedux } from "../../../../hooks/index";

// components
import AudioCallModal from "../../../../components/AudioCallModal";
import VideoCallModal from "../../../../components/VideoCallModal";
import AddPinnedTabModal from "../../../../components/AddPinnedTabModal";

// interface
import { PinTypes } from "../../../../data/chat";

// actions
import { changeSelectedChat } from "../../../../redux/actions";

// constants
import { STATUS_TYPES } from "../../../../constants";
import Loader from "../../../../components/Loader";
import InviteChannelModal from "../../../../components/InviteChannelModal";
import RollCallModal from "../../../../components/RollCallModal";
import GroupMeetingModal from "../../../../components/GroupMeetingModal";
interface ProfileImageProps {
  chatUserDetails: any;
  onCloseConversation: () => any;
  onOpenUserDetails: () => any;
  isChannel: boolean;
}
const ProfileImage = ({
  chatUserDetails,
  onCloseConversation,
  onOpenUserDetails,
  isChannel,
}: ProfileImageProps) => {
  const { useAppSelector } = useRedux();

  const { channelMembers } = useAppSelector(state => ({
    channelMembers: state.Chats.channelMembers,
  }));

  const fullName = chatUserDetails.name;
  /*const shortName = !isChannel
    ? chatUserDetails.firstName
      ? `${chatUserDetails.firstName.charAt(
          0
        )}${chatUserDetails.lastName.charAt(0)}`
      : "-"
    : "#";*/

  const colors = [
    "bg-primary",
    "bg-danger",
    "bg-info",
    "bg-warning",
    "bg-secondary",
    "bg-pink",
    "bg-purple",
  ];
  const [color] = useState(Math.floor(Math.random() * colors.length));

  const isOnline = true;
  //chatUserDetails.status && chatUserDetails.status === STATUS_TYPES.ACTIVE;

  return (
    <div className="d-flex align-items-center">
      <div className="flex-shrink-0 d-block d-lg-none me-2">
        <Link
          to="#"
          onClick={onCloseConversation}
          className="user-chat-remove text-muted font-size-24 p-2"
        >
          <i className="bx bx-chevron-left align-middle"></i>
        </Link>
      </div>
      <div className="flex-grow-1 overflow-hidden">
        <div className="d-flex align-items-center">
          <div
            className={classnames(
              "flex-shrink-0",
              "chat-user-img",
              "align-self-center",
              "me-3",
              "ms-0",
              { online: isOnline }
            )}
          >
            {chatUserDetails.photo ? (
              <>
                <img
                  src={chatUserDetails.photo}
                  className="rounded-circle avatar-sm"
                  alt=""
                />
                <span
                  className={classnames(
                    "user-status",
                    {
                      "bg-success":
                        chatUserDetails.status === STATUS_TYPES.ACTIVE,
                    },
                    {
                      "bg-warning":
                        chatUserDetails.status === STATUS_TYPES.AWAY,
                    },
                    {
                      "bg-danger":
                        chatUserDetails.status === STATUS_TYPES.DO_NOT_DISTURB,
                    }
                  )}
                ></span>
              </>
            ) : (
              <div className="avatar-sm align-self-center">
                <span
                  className={classnames(
                    "avatar-title",
                    "rounded-circle",
                    "text-uppercase",
                    "text-white",
                    colors[color]
                  )}
                >
                  <span className="username"> {fullName.substring(0, 1)}</span>
                  <span className="user-status"></span>
                </span>
              </div>
            )}
          </div>
          <div className="flex-grow-1 position-relative">
            <h6 className="text-truncate mb-0 font-size-18">
              <Link
                to="#"
                onClick={onOpenUserDetails}
                className="user-profile-show text-reset"
              >
                {fullName}
              </Link>
            </h6>
            {isChannel ? (
              channelMembers ? (
                <p className="text-truncate text-muted mb-0">
                  <small>{channelMembers.length} Members</small>
                </p>
              ) : (
                <>
                  <Loader />
                </>
              )
            ) : (
              <p className="text-truncate text-muted mb-0">
                <small>{chatUserDetails.status}</small>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Search = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle
        color="none"
        className="btn nav-btn dropdown-toggle"
        type="button"
      >
        <i className="bx bx-search"></i>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg">
        <div className="search-box p-2">
          <Input type="text" className="form-control" placeholder="Search.." />
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};
interface MoreProps {
  onOpenUserDetails: () => void;
  onOpenAudio: () => void;
  onOpenVideo: () => void;
  onDelete: () => void;
  isArchive: boolean;
  onToggleArchive: () => void;
  isChannel: boolean;
  onOpenInvite: () => void;
}
const More = ({
  onOpenUserDetails,
  onOpenAudio,
  onOpenVideo,
  onDelete,
  isArchive,
  onToggleArchive,
  isChannel,
  onOpenInvite,
}: MoreProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle color="none" className="btn nav-btn" type="button">
        <i className="bx bx-dots-vertical-rounded"></i>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        <DropdownItem
          className="d-flex justify-content-between align-items-center user-profile-show"
          to="#"
          onClick={onOpenUserDetails}
        >
          View Profile <i className="bx bx-user text-muted"></i>
        </DropdownItem>

        {isChannel ? (
          <DropdownItem
            className="d-flex justify-content-between align-items-center user-profile-show"
            to="#"
            onClick={onOpenInvite}
          >
            Invite <i className="bx bx-user-plus text-muted"></i>
          </DropdownItem>
        ) : null}

        <DropdownItem
          className="d-flex justify-content-between align-items-center d-xxl-none"
          to="#"
          onClick={onOpenAudio}
        >
          RollCall <i className="bx bxs-phone-call text-muted"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex justify-content-between align-items-center d-xxl-none"
          to="#"
          onClick={onOpenVideo}
        >
          Meeting <i className="bx bx-video text-muted"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex justify-content-between align-items-center"
          to="#"
          onClick={onToggleArchive}
        >
          {isArchive ? (
            <>
              Un-Archive <i className="bx bx-archive-out text-muted"></i>
            </>
          ) : (
            <>
              Archive <i className="bx bx-archive text-muted"></i>
            </>
          )}
        </DropdownItem>
        <DropdownItem
          className="d-flex justify-content-between align-items-center"
          to="#"
        >
          Team <i className="bx bx-microphone-off text-muted"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex justify-content-between align-items-center"
          to="#"
          onClick={onDelete}
        >
          Homework <i className="bx bx-trash text-muted"></i>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

interface PinnedAlertProps {
  onOpenPinnedTab: () => void;
}
const PinnedAlert = ({ onOpenPinnedTab }: PinnedAlertProps) => {
  const [visible, setVisible] = useState(true);

  const onDismiss = () => setVisible(false);

  return (
    <Alert
      color="warning"
      isOpen={visible}
      toggle={onDismiss}
      className="topbar-bookmark p-1 px-3 px-lg-4 pe-lg-5 pe-5 alert-dismiss-custom"
      role="alert"
    >
      <div className="d-flex align-items-start bookmark-tabs">
        <div className="tab-list-link">
          <Link to="#" className="tab-links" onClick={onOpenPinnedTab}>
            <i className="ri-pushpin-fill align-middle me-1"></i> 10 Pinned
          </Link>
        </div>
        <div id="add-bookmark">
          <Link to="#" className="tab-links border-0 px-3">
            <i className="ri-add-fill align-middle"></i>
          </Link>
        </div>
        <UncontrolledTooltip target="add-bookmark" placement="bottom">
          Add Bookmark
        </UncontrolledTooltip>
      </div>
    </Alert>
  );
};
interface UserHeadProps {
  chatUserDetails: any;
  pinnedTabs: Array<PinTypes>;
  onOpenUserDetails: () => void;
  onDelete: () => void;
  isChannel: boolean;
  onToggleArchive: () => void;
}
const UserHead = ({
  chatUserDetails,
  pinnedTabs,
  onOpenUserDetails,
  onDelete,
  isChannel,
  onToggleArchive,
}: UserHeadProps) => {
  // global store
  const { dispatch } = useRedux();
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
  pinned tab modal
  */
  const [isOpenPinnedTabModal, setIsOpenPinnedTabModal] =
    useState<boolean>(false);
  const onOpenPinnedTab = () => {
    setIsOpenPinnedTabModal(true);
  };
  const onClosePinnedTab = () => {
    setIsOpenPinnedTabModal(false);
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
  mobile menu chat conversation close
  */
  const onCloseConversation = () => {
    dispatch(changeSelectedChat(null));
  };

  return (
    <div className="p-3 p-lg-4 user-chat-topbar">
      <Row className="align-items-center">
        <Col className="col-9">
          <ProfileImage
            chatUserDetails={chatUserDetails}
            onCloseConversation={onCloseConversation}
            onOpenUserDetails={onOpenUserDetails}
            isChannel={isChannel}
          />
        </Col>
        <Col className="col-3">
          <ul className="list-inline user-chat-nav text-end mb-0">
            <li className="list-inline-item">
              <Search />
            </li>
            <li className="list-inline-item d-none d-xxl-inline-block me-2 ms-0">
              <Button
                type="button"
                color="none"
                className="btn nav-btn"
                onClick={onOpenAudio}
              >
                <i className="bx bxs-phone-call"></i>
              </Button>
            </li>
            <li className="list-inline-item d-none d-xxl-inline-block me-2 ms-0">
              <Button
                type="button"
                color="none"
                className="btn nav-btn"
                onClick={onOpenVideo}
              >
                <i className="bx bx-video"></i>
              </Button>
            </li>

            <li className="list-inline-item d-none me-2 ms-0">
              <button
                onClick={onOpenUserDetails}
                type="button"
                className="btn nav-btn user-profile-show"
              >
                <i className="bx bxs-info-circle"></i>
              </button>
            </li>

            <li className="list-inline-item">
              <More
                onOpenUserDetails={onOpenUserDetails}
                onOpenAudio={onOpenAudio}
                onOpenVideo={onOpenVideo}
                onDelete={onDelete}
                isArchive={chatUserDetails.isArchived}
                onToggleArchive={onToggleArchive}
                isChannel={isChannel}
                onOpenInvite={onOpenInvite}
              />
            </li>
          </ul>
        </Col>
      </Row>
      {/*<PinnedAlert onOpenPinnedTab={onOpenPinnedTab} />*/}
      {isOpenAudioModal && (
        <RollCallModal
          isOpen={isOpenAudioModal}
          onClose={onCloseAudio}
        />
      )}
      {isOpenVideoModal && (
        <GroupMeetingModal
          isOpen={isOpenVideoModal}
          meetingId={0}
          onClose={onCloseVideo}
        />

        // <VideoCallModal
        // isBeenCalled={false}
        // isOpen={isOpenVideoModal}
        // onClose={onCloseVideo}
        // callInfo={chatUserDetails}
        // user={chatUserDetails}
        // />
      )}
      {isOpenPinnedTabModal && (
        <AddPinnedTabModal
          isOpen={isOpenPinnedTabModal}
          onClose={onClosePinnedTab}
          pinnedTabs={pinnedTabs}
        />
      )}
      {isOpenInviteModal && (
        <InviteChannelModal
          isOpen={isOpenInviteModal}
          onClose={onCloseInvite}
        />
      )}
    </div>
  );
};

export default UserHead;