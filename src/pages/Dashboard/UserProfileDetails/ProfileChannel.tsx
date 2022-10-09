import React, { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";
import classnames from "classnames";

//images
import imagePlaceholder from "../../../assets/images/users/profile-placeholder.png";

// constants
import { STATUS_TYPES } from "../../../constants";

//interfaces
import { userModel } from "../../../redux/auth/types";
import { useProfile, useRedux } from "../../../hooks";
import { getChannels, kickOutMember } from "../../../redux/actions";

interface ProfileChannelProps {
  onCloseUserDetails: () => any;
  selectedChatInfo: userModel;
  onOpenInvite: () => void;
  onOpenRollCall: () => void;
}
const ProfileChannel = ({
  onCloseUserDetails,
  selectedChatInfo,
  onOpenInvite,
  onOpenRollCall,
}: ProfileChannelProps) => {
  const { dispatch } = useRedux();
  const { userProfile } = useProfile();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  const onLeave = () => {
    dispatch(kickOutMember(selectedChatInfo.id, userProfile.id));
    dispatch(getChannels(userProfile.id.toString()));
  };

  const fullName = selectedChatInfo.name;

  return (
    <div className="p-3 border-bottom">
      <div className="">
        <div>
          <div className="user-chat-nav p-2" style={{ height: "100%" }}>
            <div className="d-flex w-100">
              <div className="flex-grow-1">
                <Button
                  color="none"
                  type="button"
                  className="btn nav-btn user-profile-show d-none d-lg-block"
                  onClick={onCloseUserDetails}
                >
                  <i className="bx bx-x"></i>
                </Button>
                <Button
                  type="button"
                  color="none"
                  className="btn nav-btn user-profile-show d-block d-lg-none"
                  onClick={onCloseUserDetails}
                >
                  <i className="bx bx-left-arrow-alt"></i>
                </Button>
              </div>
              <div className="flex-shrink-0">
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle
                    color="none"
                    className="btn nav-btn"
                    type="button"
                  >
                    <i className="bx bx-dots-vertical-rounded"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
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
                    {/* <DropdownItem
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
                      </DropdownItem> */}
                    <DropdownItem
                      className="d-flex justify-content-between align-items-center"
                      to="#"
                    >
                      檔案 <i className="mdi mdi-folder-multiple"></i>
                    </DropdownItem>
                    <DropdownItem
                      className="d-flex justify-content-between align-items-center"
                      to="#"
                      //onClick={onDelete}
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
              </div>
            </div>
          </div>
          <div className="mt-auto p-3">
            <small className="text-muted">頻道名稱</small>
            <h5 className="user-name mt-3 mx-3 text-truncate">{fullName}</h5>
            {/*chatUserDetails.status && (
              <p className="font-size-14 text-truncate mb-0">
                <i
                  className={classnames(
                    "bx",
                    "bxs-circle",
                    "font-size-10",
                    "me-1",
                    "ms-0",
                    {
                      "text-success":
                        chatUserDetails.status === STATUS_TYPES.ACTIVE,
                    },
                    {
                      "text-warning":
                        chatUserDetails.status === STATUS_TYPES.AWAY,
                    },
                    {
                      "text-danger":
                        chatUserDetails.status === STATUS_TYPES.DO_NOT_DISTURB,
                    }
                  )}
                ></i>{" "}
                {chatUserDetails.status*}
              </p>
            )*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileChannel;
