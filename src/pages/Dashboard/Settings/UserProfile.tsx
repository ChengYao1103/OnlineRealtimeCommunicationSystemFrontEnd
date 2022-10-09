import React, { useEffect, useState } from "react";
import avatarPlaceHolder from "../../../assets/images/users/profile-placeholder.png";
import {
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useRedux } from "../../../hooks";
import { userChangeInformation } from "../../../redux/actions";
import classnames from "classnames";

// interface
import { BasicDetailsTypes } from "../../../data/settings";
import { userModel } from "../../../redux/auth/types";

// CONSTANTS
import { STATUS_TYPES } from "../../../constants";
interface UserProfileProps {
  user: userModel;
  status: STATUS_TYPES;
}
const UserProfile = ({ user, status }: UserProfileProps) => {
  const { dispatch } = useRedux();
  const fullName = user ? user.name : "-";

  /*
    profile image
    */
  const [image, setImage] = useState<string>("");
  useEffect(() => {
    setImage(user.photo);
  }, [user]);

  const onChangeProfile = (e: any) => {
    const files = [...e.target.files];
    if (files[0]) {
      // 將圖片轉換為base64
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        //儲存轉換完成之圖片
        const base64 = reader.result;
        var data = { newPhoto: base64 };
        if (typeof base64 === "string") {
          dispatch(userChangeInformation(data));
          setImage(base64);
        }
      };
    }
  };

  /*
    drop down state
    */
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  /*
    status
    */
  const [userStatus, setUserStatus] = useState<STATUS_TYPES>(
    STATUS_TYPES.ACTIVE
  );
  const onChangeStatus = (status: STATUS_TYPES) => {
    setUserStatus(status);
  };
  useEffect(() => {
    setUserStatus(status);
  }, [status]);

  return (
    <div className="text-center p-3 p-lg-4 border-bottom pt-2 pt-lg-2 mt-n5 position-relative">
      <div className="mb-3 profile-user">
        <img
          src={image ? image : avatarPlaceHolder}
          className="rounded-circle avatar-lg img-thumbnail user-profile-image"
          alt="user-profile"
        />
        <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
          <input
            onChange={(e: any) => onChangeProfile(e)}
            id="profile-img-file-input"
            type="file"
            className="profile-img-file-input"
            accept="image/png, image/jpeg"
          />
          <Label
            htmlFor="profile-img-file-input"
            className="profile-photo-edit avatar-xs"
          >
            <span className="avatar-title rounded-circle bg-light text-body">
              <i className="bx bxs-camera"></i>
            </span>
          </Label>
        </div>
      </div>

      <h5 className="font-size-16 mb-1 text-truncate">{fullName}</h5>

      {/* <Dropdown
        className="d-inline-block"
        isOpen={dropdownOpen}
        toggle={toggle}
      >
        <DropdownToggle tag="a" className="text-muted d-block" role="button">
          <i
            className={classnames(
              "bx",
              "bxs-circle",
              "font-size-10",
              "align-middle",
              { "text-success": userStatus === STATUS_TYPES.ACTIVE },
              { "text-warning": userStatus === STATUS_TYPES.AWAY },
              { "text-danger": userStatus === STATUS_TYPES.DO_NOT_DISTURB }
            )}
          ></i>{" "}
          {userStatus} <i className="mdi mdi-chevron-down"></i>
        </DropdownToggle>

        <DropdownMenu>
          <DropdownItem onClick={() => onChangeStatus(STATUS_TYPES.ACTIVE)}>
            <i className="bx bxs-circle text-success font-size-10 me-1 align-middle"></i>{" "}
            線上
          </DropdownItem>
          <DropdownItem onClick={() => onChangeStatus(STATUS_TYPES.AWAY)}>
            <i className="bx bxs-circle text-warning font-size-10 me-1 align-middle"></i>{" "}
            閒置
          </DropdownItem>
          <DropdownItem
            onClick={() => onChangeStatus(STATUS_TYPES.DO_NOT_DISTURB)}
          >
            <i className="bx bxs-circle text-danger font-size-10 me-1 align-middle"></i>{" "}
            請勿打擾
          </DropdownItem>
        </DropdownMenu>
      </Dropdown> */}
    </div>
  );
};

export default UserProfile;
