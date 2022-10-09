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
import { useProfile, useRedux } from "../../../../hooks/index";

// components
import AudioCallModal from "../../../../components/AudioCallModal";
import VideoCallModal from "../../../../components/VideoCallModal";
import AddPinnedTabModal from "../../../../components/AddPinnedTabModal";

// interface
import { PinTypes } from "../../../../data/chat";

// actions
import { changeSelectedChat, kickOutMember } from "../../../../redux/actions";

// constants
import { STATUS_TYPES } from "../../../../constants";
import Loader from "../../../../components/Loader";
import InviteChannelModal from "../../../../components/InviteChannelModal";
import RollCallModal from "../../../../components/RollCallModal";
import ChannelMeetingModal from "../../../../components/ChannelMeetingModal";
interface ProfileImageProps {
  selectedChatInfo: any;
  onCloseConversation: () => any;
  onOpenUserDetails: () => any;
  isChannel: boolean;
}
const ProfileImage = ({
  selectedChatInfo,
  onCloseConversation,
  onOpenUserDetails,
  isChannel,
}: ProfileImageProps) => {
  const { useAppSelector } = useRedux();

  const { channelMembers } = useAppSelector(state => ({
    channelMembers: state.Chats.channelMembers,
  }));

  const fullName = selectedChatInfo.name;
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
            {selectedChatInfo.photo ? (
              <>
                <img
                  src={selectedChatInfo.photo}
                  className="rounded-circle avatar-sm"
                  alt=""
                />
                <span
                  className={classnames(
                    "user-status",
                    {
                      "bg-success":
                        selectedChatInfo.status === STATUS_TYPES.ACTIVE,
                    },
                    {
                      "bg-warning":
                        selectedChatInfo.status === STATUS_TYPES.AWAY,
                    },
                    {
                      "bg-danger":
                        selectedChatInfo.status === STATUS_TYPES.DO_NOT_DISTURB,
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
                  <small>{channelMembers.length} 個成員</small>
                </p>
              ) : (
                <>
                  <Loader />
                </>
              )
            ) : (
              <p className="text-truncate text-muted mb-0">
                <small>{selectedChatInfo.status}</small>
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
  onOpenVideo: () => void;
  onDelete: () => void;
  onLeave: () => void;
  isArchive: boolean;
  onToggleArchive: () => void;
  isChannel: boolean;
  onOpenInvite: () => void;
  onOpenRollCall: () => void;
}
const More = ({
  onOpenUserDetails,
  onOpenVideo,
  onDelete,
  onLeave,
  isArchive,
  onToggleArchive,
  isChannel,
  onOpenInvite,
  onOpenRollCall,
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
          查看群組資料 <i className="bx bx-user text-muted"></i>
        </DropdownItem>

        <DropdownItem
          className="d-flex justify-content-between align-items-center user-profile-show"
          to="#"
          onClick={onOpenInvite}
        >
          邀請成員 <i className="bx bx-user-plus text-muted"></i>
        </DropdownItem>

        <DropdownItem
          className="d-flex justify-content-between align-items-center"
          to="#"
          onClick={onOpenRollCall}
        >
          點名 <i className="mdi mdi-bell-ring"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex justify-content-between align-items-center"
          to="#"
          onClick={onOpenVideo}
        >
          開始會議 <i className="bx bx-video text-muted"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex justify-content-between align-items-center"
          to="#"
          onClick={onToggleArchive}
        >
          {isArchive ? (
            <>
              解除封存 <i className="bx bx-archive-out text-muted"></i>
            </>
          ) : (
            <>
              封存 <i className="bx bx-archive text-muted"></i>
            </>
          )}
        </DropdownItem>
        <DropdownItem
          className="d-flex justify-content-between align-items-center"
          to="#"
        >
          檔案 <i className="mdi mdi-folder-multiple"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex justify-content-between align-items-center"
          to="#"
          onClick={onDelete}
        >
          作業 <i className="mdi mdi-pencil"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex text-danger justify-content-between align-items-center"
          to="#"
          onClick={onLeave}
        >
          退出群組 <i className="bx bx-trash text-danger"></i>
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
          建立書籤
        </UncontrolledTooltip>
      </div>
    </Alert>
  );
};
interface UserHeadProps {
  selectedChatInfo: any;
  pinnedTabs: Array<PinTypes>;
  onOpenUserDetails: () => void;
  onDelete: () => void;
  isChannel: boolean;
  onToggleArchive: () => void;
}
const UserHead = ({
  selectedChatInfo,
  pinnedTabs,
  onOpenUserDetails,
  onDelete,
  isChannel,
  onToggleArchive,
}: UserHeadProps) => {
  // global store
  const { dispatch } = useRedux();
  const { userProfile } = useProfile();
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
  mobile menu chat conversation close
  */
  const onCloseConversation = () => {
    dispatch(changeSelectedChat(null));
  };

  /* 離開群組 */
  const onLeave = () => {
    console.log(selectedChatInfo.id);
    dispatch(kickOutMember(selectedChatInfo.id, userProfile.id));
  };

  return (
    <div className="p-3 p-lg-4 user-chat-topbar">
      <Row className="align-items-center">
        <Col className="col-9">
          <ProfileImage
            selectedChatInfo={selectedChatInfo}
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
                onClick={onOpenRollCall}
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
                onOpenVideo={onOpenVideo}
                onDelete={onDelete}
                onLeave={onLeave}
                isArchive={selectedChatInfo.isArchived}
                onToggleArchive={onToggleArchive}
                isChannel={isChannel}
                onOpenInvite={onOpenInvite}
                onOpenRollCall={onOpenRollCall}
              />
            </li>
          </ul>
        </Col>
      </Row>
      {/*<PinnedAlert onOpenPinnedTab={onOpenPinnedTab} />*/}
      {isOpenVideoModal && (
        <ChannelMeetingModal
          isOpen={isOpenVideoModal}
          channelId={selectedChatInfo.id}
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
      {isOpenRollCallModal && (
        <RollCallModal isOpen={isOpenRollCallModal} onClose={onCloseRollCall} />
      )}
    </div>
  );
};

export default UserHead;
