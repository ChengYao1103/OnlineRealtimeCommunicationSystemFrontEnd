import React from "react";
import { Link } from "react-router-dom";

// hooks
import { useRedux } from "../../../hooks/index";

// actions
import {
  getChannelDetails,
  getChatUserDetails,
  getChatUserConversations,
  changeSelectedChat,
} from "../../../redux/actions";

interface GroupProps {
  group: any;
}
const Group = ({ group }: GroupProps) => {
  // global store
  const { dispatch } = useRedux();

  const onSelectChat = (id: string | number, isChannel?: boolean) => {
    if (isChannel) {
      dispatch(getChannelDetails(id));
    } else {
      dispatch(getChatUserDetails(id));
    }
    //dispatch(getChatUserConversations(id));
    dispatch(changeSelectedChat(id));
  };

  return (
    <li>
      <Link to="#" onClick={() => onSelectChat(group.id, true)}>
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0 avatar-xs me-2">
            <span className="avatar-title rounded-circle bg-soft-light text-dark">
              #
            </span>
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <p className="text-truncate mb-0">{group.name}</p>
          </div>
        </div>
      </Link>
    </li>
  );
};
interface GroupsProps {
  selectedChatInfo: any;
}
const Groups = ({ selectedChatInfo }: GroupsProps) => {
  const groups =
    selectedChatInfo.channels &&
    selectedChatInfo.channels.length &&
    selectedChatInfo.channels;
  return (
    <div>
      <div className="d-flex">
        <div className="flex-grow-1">
          <h5 className="font-size-11 text-muted text-uppercase">共同頻道</h5>
        </div>
      </div>

      {groups ? (
        <ul className="list-unstyled chat-list mx-n4">
          {(groups || []).map((group: any, key: number) => (
            <Group group={group} key={key} />
          ))}
        </ul>
      ) : (
        <p>無共同頻道</p>
      )}
    </div>
  );
};

export default Groups;
