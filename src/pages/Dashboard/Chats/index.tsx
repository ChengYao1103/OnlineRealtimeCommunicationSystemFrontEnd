import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, UncontrolledTooltip } from "reactstrap";
import { Link } from "react-router-dom";
// action
import { getUserId, clearOtherUserId } from "../../../redux/actions";
// hooks
import { useProfile, useRedux } from "../../../hooks/index";

// actions
import {
  inviteContact,
  resetContacts,
  getFavourites,
  getDirectMessages,
  getChannels,
  getRecentChat,
  addContacts,
  createChannel,
  changeSelectedChat,
  getChatUserDetails,
  getChatUserConversations,
  getChannelDetails,
  getArchiveContact,
  onSendMessage,
  readConversation,
} from "../../../redux/actions";

// interfaces
import { CreateChannelPostData } from "../../../redux/actions";
import { userModel } from "../../../redux/auth/types";
import {
  channelModel,
  messageModel,
  recentChatUserModel,
} from "../../../redux/chats/types";
import { DataTypes as newMessageTypes } from "../../../components/StartNewMessageModal";

// components
import AppSimpleBar from "../../../components/AppSimpleBar";
import AddGroupModal from "../../../components/AddGroupModal";
import InviteContactModal from "../../../components/InviteContactModal";
import StartNewMessageModal from "../../../components/StartNewMessageModal";
import AddButton from "../../../components/AddButton";
import ContactModal from "../../../components/ContactModal";

import Favourites from "./Favourites";
import DirectMessages from "./DirectMessages";
import Chanels from "./Chanels";
import Archive from "./Archive";
import { CHATS_TABS } from "../../../constants";
import { showErrorNotification } from "../../../helpers/notifications";

interface IndexProps {}
const Index = (props: IndexProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  const {
    AuthState,
    isContactInvited,
    favourites,
    recentChatUsers,
    channels,
    isContactsAdded,
    isChannelCreated,
    selectedChat,
    selectedChatInfo,
    isFavouriteContactToggled,
    archiveContacts,
    isContactArchiveToggled,
    chatUserDetails,
  } = useAppSelector(state => ({
    AuthState: state.Auth,
    isContactInvited: state.Contacts.isContactInvited,
    favourites: state.Chats.favourites,
    recentChatUsers: state.Chats.recentChatUsers,
    channels: state.Chats.channels,
    isContactsAdded: state.Chats.isContactsAdded,
    isChannelCreated: state.Chats.isChannelCreated,
    selectedChat: state.Chats.selectedChat,
    selectedChatInfo: state.Chats.selectedChatInfo,
    isFavouriteContactToggled: state.Chats.isFavouriteContactToggled,
    archiveContacts: state.Chats.archiveContacts,
    isContactArchiveToggled: state.Chats.isContactArchiveToggled,
    chatUserDetails: state.Chats.chatUserDetails,
  }));
  const { userProfile } = useProfile();
  /*
  get data
  */
  useEffect(() => {
    dispatch(getRecentChat(10, 1)); // get recent 1 messages with 10 users
    dispatch(getFavourites());
    dispatch(getDirectMessages());
    dispatch(getChannels(userProfile.id.toString()));
  }, [dispatch, userProfile]);
  useEffect(() => {
    if (isFavouriteContactToggled) {
      dispatch(getFavourites());
      dispatch(getDirectMessages());
    }
  }, [dispatch, isFavouriteContactToggled]);

  /*
  invite contact modal handeling
  */
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  /*
  onInvite handeling
  */
  const onInviteContact = (data: any) => {
    dispatch(inviteContact(data));
  };
  useEffect(() => {
    if (isContactInvited) {
      setIsOpen(false);
      setTimeout(() => {
        dispatch(resetContacts("isContactInvited", false));
      }, 1000);
    }
  }, [dispatch, isContactInvited]);

  /*
  Start a new message handeling
  */
  const [isOpenNewMessage, setIsOpenNewMessage] = useState<boolean>(false);
  const [isGetReceicerId, setIsGetReceicerId] = useState<boolean>(false);
  const [isWaitingSend, setIsWaitingSend] = useState<boolean>(false);
  const [contacts, setContacts] = useState<newMessageTypes>({
    email: null,
    content: null,
  });
  const [newMessageData, setNewMessageData] = useState<messageModel>({
    receiverID: 0,
    content: null,
    type: 0,
  });
  const openNewMessageModal = () => {
    setIsOpenNewMessage(true);
  };
  const closeNewMessageModal = () => {
    setIsOpenNewMessage(false);
  };
  const onCreateNewMessage = (contacts: newMessageTypes) => {
    if (contacts.email) {
      setContacts(contacts);
      dispatch(getUserId(contacts.email));
      setIsGetReceicerId(false);
      setIsWaitingSend(true);
    }
  };
  useEffect(() => {
    if (AuthState.otherUserId && !isGetReceicerId) {
      setIsGetReceicerId(true);
      if (AuthState.otherUserId === userProfile.id) {
        showErrorNotification("Can't send message to self.");
      } else if (AuthState.otherUserId !== 0) {
        setNewMessageData({
          receiverID: AuthState.otherUserId,
          content: contacts.content,
          type: 0,
        });
      } else {
        showErrorNotification(
          "No corresponding user, please check email again."
        );
      }
    }
    if (AuthState.otherUserId && isGetReceicerId) {
      dispatch(clearOtherUserId());
    }
    if (newMessageData.receiverID !== 0 && isWaitingSend) {
      setIsWaitingSend(false);
      dispatch(onSendMessage(newMessageData));
      dispatch(getRecentChat(10, 1));

      setContacts({ email: null, content: null });
      setNewMessageData({
        receiverID: 0,
        content: null,
        type: 0,
      });
      setIsOpenNewMessage(false);
    }
  }, [
    dispatch,
    AuthState,
    userProfile,
    isGetReceicerId,
    isWaitingSend,
    contacts,
    newMessageData,
  ]);
  useEffect(() => {
    if (isContactsAdded) {
      setIsOpenNewMessage(false);
      dispatch(getDirectMessages());
    }
  }, [dispatch, isContactsAdded]);

  /*
  channel creation handeling
  */
  const [isOpenCreateChannel, setIsOpenCreateChannel] =
    useState<boolean>(false);
  const openCreateChannelModal = () => {
    setIsOpenCreateChannel(true);
  };
  const closeCreateChannelModal = () => {
    setIsOpenCreateChannel(false);
  };
  const onCreateChannel = (channelData: CreateChannelPostData) => {
    dispatch(createChannel(channelData));
  };
  useEffect(() => {
    if (isChannelCreated) {
      setIsOpenCreateChannel(false);
      dispatch(getChannels(userProfile.id.toString()));
    }
  }, [dispatch, isChannelCreated, userProfile]);

  /*
  select chat handeling :
    get conversations
    get chat user details
  */

  const onSelectChat = (
    id: string | number,
    info: userModel | channelModel,
    isChannel?: boolean
  ) => {
    if (selectedChatInfo === info) {
      return;
    }
    if (isChannel) {
      dispatch(getChannelDetails(id));
    } else {
      dispatch(getChatUserDetails(id));
    }
    dispatch(readConversation(id));
    //dispatch(getChatUserConversations(id));
    dispatch(changeSelectedChat(id, info));
  };

  /*
  tab handeling
  */
  const [active, setActive] = useState(CHATS_TABS.DEFAULT);
  const onChangeTab = (tab: CHATS_TABS) => {
    setActive(tab);
  };

  /*
  archive contacts
  */
  useEffect(() => {
    dispatch(getArchiveContact());
  }, [dispatch]);
  useEffect(() => {
    if (isContactArchiveToggled) {
      dispatch(getArchiveContact());
      dispatch(getFavourites());
      dispatch(getDirectMessages());
      dispatch(getChannels(userProfile.id.toString()));
      dispatch(getChatUserDetails(chatUserDetails.id));
    }
  }, [dispatch, isContactArchiveToggled, chatUserDetails.id, userProfile]);

  return (
    <>
      <div>
        <div className="px-4 pt-4">
          <div className="d-flex align-items-start">
            <div className="flex-grow-1">
              <h4 className="mb-4">Chats</h4>
            </div>
            <div className="flex-shrink-0">
              <div id="add-contact">
                {/* Button trigger modal */}
                <AddButton onClick={openModal} />
              </div>
              <UncontrolledTooltip target="add-contact" placement="bottom">
                Add Contact
              </UncontrolledTooltip>
            </div>
          </div>
          <Form>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control bg-light border-0 pe-0"
                placeholder="Search here.."
                aria-label="Example text with button addon"
                aria-describedby="searchbtn-addon"
              />
              <Button
                className="btn btn-light"
                type="button"
                id="searchbtn-addon"
              >
                <i className="bx bx-search align-middle"></i>
              </Button>
            </div>
          </Form>
        </div>{" "}
        {/* .p-4 */}
        <AppSimpleBar className="chat-room-list">
          {/* Start chat-message-list */}
          {active === CHATS_TABS.DEFAULT && (
            <>
              {/* favourite *
              <Favourites
                users={favourites}
                selectedChat={selectedChat}
                onSelectChat={onSelectChat}
              />/}

              {/* direct messages */}
              <DirectMessages
                authUser={userProfile}
                recentChatArray={
                  recentChatUsers || ([] as recentChatUserModel[])
                }
                openAddContact={openNewMessageModal}
                selectedChat={selectedChat}
                onSelectChat={onSelectChat}
              />

              {/* channels list */}
              <Chanels
                channels={channels}
                openCreateChannel={openCreateChannelModal}
                selectedChat={selectedChat}
                onSelectChat={onSelectChat}
              />
              <h5 className="text-center mb-2">
                <Link
                  to="#"
                  className="mb-3 px-4 mt-4 font-size-11 text-primary"
                  onClick={() => onChangeTab(CHATS_TABS.ARCHIVE)}
                >
                  Archived Contacts{" "}
                  <i className="bx bxs-archive-in align-middle" />
                </Link>
              </h5>
            </>
          )}
          {active === CHATS_TABS.ARCHIVE && (
            <>
              <Archive
                archiveContacts={archiveContacts}
                selectedChat={selectedChat}
                onSelectChat={onSelectChat}
              />
              <h5 className="text-center mb-2">
                <Link
                  to="#"
                  className="mb-3 px-4 mt-4 font-size-11 text-primary"
                  onClick={() => onChangeTab(CHATS_TABS.DEFAULT)}
                >
                  Chats <i className="bx bxs-archive-out align-middle" />
                </Link>
              </h5>
            </>
          )}

          {/* End chat-message-list */}
        </AppSimpleBar>
      </div>
      {/* add group Modal */}
      {isOpenCreateChannel && (
        <AddGroupModal
          isOpen={isOpenCreateChannel}
          onClose={closeCreateChannelModal}
          founderId={userProfile.id}
          onCreateChannel={onCreateChannel}
        />
      )}

      {/* add contact modal */}
      {isOpen && (
        <InviteContactModal
          isOpen={isOpen}
          onClose={closeModal}
          onInvite={onInviteContact}
        />
      )}

      {/* start new message modal */}
      {isOpenNewMessage && (
        <StartNewMessageModal
          isOpen={isOpenNewMessage}
          onClose={closeNewMessageModal}
          onCreateNewMessage={onCreateNewMessage}
        />
      )}
    </>
  );
};

export default Index;
