import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { Badge, Button } from "reactstrap";

// hooks
import { useProfile, useRedux } from "../../../hooks/index";

// actions
import {
  getChannelDetails,
  getChatUserDetails,
  getChatUserConversations,
  changeSelectedChat,
  getChannelMembers,
  getRole,
  kickOutMember,
} from "../../../redux/actions";
import { channelMemberModel, channelModel } from "../../../redux/chats/types";
import { RoleTypes } from "../../../repository/Enum";

interface MemberProps {
  member: channelMemberModel;
  channelInfo: channelModel;
}
const Member = ({ member, channelInfo }: MemberProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();
  const { channelRole } = useAppSelector(state => ({
    channelRole: state.Chats.channelRole,
  }));
  const { userProfile } = useProfile();

  useEffect(() => {
    dispatch(getRole(channelInfo.id));
  }, [dispatch, channelInfo.id]);

  const isFounder = member.id === channelInfo.founderID;

  /** 如果本身身分為老師/TA且成員身分不為老師才可以踢人 */
  const canKickOut =
    (channelRole === RoleTypes["老師"] || channelRole === RoleTypes["助教"]) &&
    member.id !== userProfile.id &&
    member.role !== RoleTypes["老師"];

  const onKickOut = () => {
    dispatch(kickOutMember(channelInfo.id, member.id));
  };

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

  const getRoleTag = (role: RoleTypes) => {
    switch (role) {
      case RoleTypes["老師"]: {
        return (
          <Badge className="badge badge-soft-danger rounded p-1 me-3 start-0">
            {RoleTypes[member.role]}
          </Badge>
        );
      }
      case RoleTypes["助教"]: {
        return (
          <Badge className="badge badge-soft-info rounded p-1 me-3 start-0">
            {RoleTypes[member.role]}
          </Badge>
        );
      }
      case RoleTypes["學生"]: {
        return (
          <Badge className="badge badge-soft-secondary rounded p-1 me-3 start-0">
            {RoleTypes[member.role]}
          </Badge>
        );
      }
    }
  };

  return (
    <li>
      <div className="d-flex me-3">
        <Link to="#" onClick={() => onSelectChat(member.id)}>
          <div className="d-flex align-items-center">
            <div>{getRoleTag(member.role)}</div>
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
              <span className="text-truncate mb-0">{member.name}</span>
            </div>
          </div>
        </Link>
        {isFounder && (
          <div className="ms-auto">
            <Badge className="badge badge-soft-primary rounded p-1">
              擁有者
            </Badge>
          </div>
        )}
        {canKickOut && (
          <div className="ms-auto">
            <Badge className="btn btn-danger" onClick={onKickOut}>
              踢除
            </Badge>
          </div>
        )}
      </div>
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
          <h5 className="font-size-11 text-muted text-uppercase">頻道成員</h5>
        </div>
      </div>

      {channelMembers ? (
        <ul className="list-unstyled chat-list mx-n4">
          {(channelMembers || []).map(
            (member: channelMemberModel, key: number) => (
              <Member
                key={key}
                member={member}
                channelInfo={selectedChatInfo}
              />
            )
          )}
        </ul>
      ) : (
        <p>無成員</p>
      )}
    </div>
  );
};

export default Members;
