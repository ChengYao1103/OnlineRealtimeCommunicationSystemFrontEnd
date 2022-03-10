import React from "react";
import { userModel } from "../../../redux/auth/types";
import { Roles } from "../../../repository/role";

// interface
interface UserDescriptionProps {
  user: userModel;
  location: string;
}

const UserDescription = ({ user, location }: UserDescriptionProps) => {
  return (
    <>
      <div className="text-muted">
        <p className="mb-4">{"從缺"}</p>
      </div>

      <div>
        <div className="d-flex py-2">
          <div className="flex-shrink-0 me-3">
            <i className="bx bx-user align-middle text-muted"></i>
          </div>
          <div className="flex-grow-1">
            <p className="mb-0">{user.name ? user.name : "-"}</p>
          </div>
        </div>

        <div className="d-flex py-2">
          <div className="flex-shrink-0 me-3">
            <i className="bx bx-envelope-open align-middle text-muted"></i>
          </div>
          <div className="flex-grow-1">
            <p className="mb-0">{user.email ? user.email : "-"}</p>
          </div>
        </div>

        <div className="d-flex py-2">
          <div className="flex-shrink-0 me-3">
            <i className="bx bx-award align-middle text-muted"></i>
          </div>
          <div className="flex-grow-1">
            <p className="mb-0">{Roles[user.role].label}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDescription;
