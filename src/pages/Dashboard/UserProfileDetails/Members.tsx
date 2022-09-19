import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { Badge } from "reactstrap";

// hooks
import { useProfile, useRedux } from "../../../hooks/index";

// actions
import {
  getChannelDetails,
  getChatUserDetails,
  getChatUserConversations,
  changeSelectedChat,
  getChannelMembers,
} from "../../../redux/actions";
import { channelModel } from "../../../redux/chats/types";
import { userModel } from "../../../redux/auth/types";

interface MemberProps {
  member: userModel;
}
const Member = ({ member }: MemberProps) => {
  // global store
  const { dispatch } = useRedux();
  const { userProfile } = useProfile();

  // const fullName = `${member.firstName} ${member.lastName}`;
  // const shortName = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`;
  const onSelectChat = (id: string | number, isChannel?: boolean) => {
    if (id === userProfile.id) {
      return;
    }

    if (isChannel) {
      dispatch(getChannelDetails(id));
    } else {
      dispatch(getChatUserDetails(id));
    }
    //dispatch(getChatUserConversations(id));
    dispatch(changeSelectedChat(id, member));
  };

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

  return (
    <li>
      <Link to="#" onClick={() => onSelectChat(member.id)}>
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0 avatar-xs me-2">
            {member.photo ? (
              <div
                className={classnames(
                  "chat-user-img",
                  "align-self-center",
                  "me-2",
                  "ms-0"
                )}
              >
                <img
                  src={member.photo}
                  className="rounded-circle avatar-xs"
                  alt=""
                />
              </div>
            ) : (
              <span
                className={classnames(
                  "avatar-title",
                  "rounded-circle",
                  "text-uppercase",
                  "text-white",
                  colors[color]
                )}
              >
                {member.name.substring(0, 1)}
              </span>
            )}
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <p className="text-truncate mb-0">{member.name}</p>
          </div>
          {/*member.isAdmin && (
            <div className="ms-auto">
              <Badge className="badge badge-soft-primary rounded p-1">
                Admin
              </Badge>
            </div>
          )*/}
        </div>
      </Link>
    </li>
  );
};

interface GroupsProps {
  selectedChatInfo: channelModel;
}
const Members = ({ selectedChatInfo }: GroupsProps) => {
  const { dispatch, useAppSelector } = useRedux();

  const { channelMembers } = useAppSelector(state => ({
    channelMembers: state.Chats.channelMembers,
  }));

  useEffect(() => {
    dispatch(getChannelMembers(selectedChatInfo.id));
  }, [selectedChatInfo]);

  return (
    <div>
      <div className="d-flex">
        <div className="flex-grow-1">
          <h5 className="font-size-11 text-muted text-uppercase">Members</h5>
        </div>
      </div>

      {channelMembers ? (
        <ul className="list-unstyled chat-list mx-n4">
          {(channelMembers || []).map((member: userModel, key: number) => (
            <Member member={member} key={key} />
          ))}
        </ul>
      ) : (
        <p>No Members</p>
      )}
    </div>
  );
};

export default Members;
