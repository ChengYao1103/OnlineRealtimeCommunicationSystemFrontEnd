import React from "react";
import { userModel } from "../../../redux/auth/types";

interface BasicDetailsProps {
  selectedChatInfo: userModel;
}
const BasicDetails = ({ selectedChatInfo }: BasicDetailsProps) => {
  const fullName = selectedChatInfo.name;

  return (
    <div className="mt-3">
      <div>
        <div className="d-flex align-items-end">
          <div className="flex-grow-1">
            <p className="text-muted font-size-14 mb-1">名稱</p>
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
          {selectedChatInfo.email ? selectedChatInfo.email : "-"}
        </h5>
      </div>
    </div>
  );
};

export default BasicDetails;
