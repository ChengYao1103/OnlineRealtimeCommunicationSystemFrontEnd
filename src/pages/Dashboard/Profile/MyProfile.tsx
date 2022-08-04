import React, { useState } from "react";
import { userModel } from "../../../redux/auth/types";
import coverPlaceHolder from "../../../assets/images/pattern-1.jpg";
import avatarPlaceHolder from "../../../assets/images/users/profile-placeholder.png";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// hooks
import { useRedux } from "../../../hooks/index";

// costants
import { TABS } from "../../../constants/index";

// actions
import { changeTab } from "../../../redux/actions";
import { getAuthInformation, getUserInformation } from "../../../redux/actions";

// interface
import { BasicDetailsTypes } from "../../../data/myProfile";

interface MyProfileProps {
  user: userModel;
  basicDetails: BasicDetailsTypes;
}

const MyProfile = ({ user, basicDetails }: MyProfileProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);
  const { dispatch } = useRedux();

  const onChangeTab = () => {
    dispatch(changeTab(TABS.SETTINGS));
  };

  const GetAuthInfo = () => {
    dispatch(getAuthInformation());
  };

  return (
    <>
      <div className="user-profile-img">
        {basicDetails && basicDetails.coverImage && (
          <img
            src={basicDetails.coverImage}
            className="profile-img"
            style={{ height: "160px" }}
            alt=""
          />
        )}
        {!basicDetails && (
          <img
            src={coverPlaceHolder}
            className="profile-img"
            style={{ height: "160px" }}
            alt=""
          />
        )}

        <div className="overlay-content">
          <div>
            <div className="user-chat-nav p-2 ps-3">
              <div className="d-flex w-100 align-items-center">
                <div className="flex-grow-1">
                  <h5 className="text-white mb-0">My Profile</h5>
                </div>
                <div className="flex-shrink-0">
                  <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle
                      color="none"
                      className="btn nav-btn text-white"
                      type="button"
                    >
                      <i className="bx bx-dots-vertical-rounded"></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end" right>
                      <DropdownItem
                        className="d-flex align-items-center justify-content-between"
                        href="#"
                        onClick={() => GetAuthInfo()}
                      >
                        Info{" "}
                        <i className="bx bx-info-circle ms-2 text-muted"></i>
                      </DropdownItem>
                      <DropdownItem
                        className="d-flex align-items-center justify-content-between"
                        onClick={() => onChangeTab()}
                      >
                        Setting <i className="bx bx-cog text-muted ms-2"></i>
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem
                        className="d-flex align-items-center justify-content-between"
                        href="#"
                      >
                        Help{" "}
                        <i className="bx bx-help-circle ms-2 text-muted"></i>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center p-3 p-lg-4 border-bottom pt-2 pt-lg-2 mt-n5 position-relative">
        <div className="mb-lg-3 mb-2">
          {user && user.Photo && (
            <img
              src={user.Photo}
              className="rounded-circle avatar-lg img-thumbnail"
              alt=""
            />
          )}
          {(!user || !user.Photo) && (
            <img
              src={avatarPlaceHolder}
              className="rounded-circle avatar-lg img-thumbnail"
              alt=""
            />
          )}
        </div>

        <h5 className="font-size-16 mb-1 text-truncate">{user.name}</h5>
      </div>
    </>
  );
};
export default MyProfile;
