import React from "react";
import { userModel } from "../../../redux/auth/types";

interface BasicDetailsProps {
  chatUserDetails: userModel;
}
const BasicDetails = ({ chatUserDetails }: BasicDetailsProps) => {
  const fullName = chatUserDetails.name;

  return (
    <div className="mt-3">
      <h5 className="font-size-11 text-muted text-uppercase">Info</h5>
      <div>
        <div className="d-flex align-items-end">
          <div className="flex-grow-1">
            <p className="text-muted font-size-14 mb-1">Name</p>
          </div>
          {/*<div className="flex-shrink-0">
            <button type="button" className="btn btn-sm btn-soft-primary">
              Edit
            </button>
  </div>*/}
        </div>
        <h5 className="font-size-14">{fullName}</h5>
      </div>

      <div className="mt-2">
        <p className="text-muted font-size-14 mb-1">Email</p>
        <h5 className="font-size-14">
          {chatUserDetails.email ? chatUserDetails.email : "-"}
        </h5>
      </div>
    </div>
  );
};

export default BasicDetails;
