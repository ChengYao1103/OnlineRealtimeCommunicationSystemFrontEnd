import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, UncontrolledTooltip } from "reactstrap";
import { Link } from "react-router-dom";
// get receiver id api
import { getUserId } from "../../../redux/actions";
// hooks
import { useRedux } from "../../../hooks/index";

// actions
import {
  inviteContact,
  resetContacts,
  getFavourites,
  getDirectMessages,
  getChannels,
  addContacts,
  createChannel,
  changeSelectedChat,
  getChatUserDetails,
  getChatUserConversations,
  getChannelDetails,
  getArchiveContact,
  readConversation,
} from "../../../redux/actions";

// interfaces
import { CreateChannelPostData } from "../../../redux/actions";
import { getUserIdResponse, userModel } from "../../../redux/auth/types";
import { messageModel } from "../../../redux/chats/types";
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

interface IndexProps {}
const Index = (props: IndexProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  const {
    AuthState,
    isContactInvited,
    favourites,
    directMessages,
    channels,
    isContactsAdded,
    isChannelCreated,
    selectedChat,
    isFavouriteContactToggled,
    archiveContacts,
    isContactArchiveToggled,
    chatUserDetails,
  } = useAppSelector(state => ({
    AuthState: state.Auth,
    isContactInvited: state.Contacts.isContactInvited,
    favourites: state.Chats.favourites,
    directMessages: state.Chats.directMessages,
    channels: state.Chats.channels,
    isContactsAdded: state.Chats.isContactsAdded,
    isChannelCreated: state.Chats.isChannelCreated,
    selectedChat: state.Chats.selectedChat,
    isFavouriteContactToggled: state.Chats.isFavouriteContactToggled,
    archiveContacts: state.Chats.archiveContacts,
    isContactArchiveToggled: state.Chats.isContactArchiveToggled,
    chatUserDetails: state.Chats.chatUserDetails,
  }));
  const authUser: userModel = AuthState.response.user;

  /*
  get data
  */
  useEffect(() => {
    dispatch(getFavourites());
    dispatch(getDirectMessages());
    dispatch(getChannels(authUser.id.toString()));
  }, [dispatch, authUser]);
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
  const openNewMessageModal = () => {
    setIsOpenNewMessage(true);
  };
  const closeNewMessageModal = () => {
    setIsOpenNewMessage(false);
  };
  const onCreateNewMessage = (contacts: newMessageTypes) => {
    if (contacts.email) {
      dispatch(getUserId(contacts.email));
    }
    if (AuthState.getInfoError !== undefined) {
      toast.error(AuthState.getInfoError);
    }
    /*if (response.status === 200) {
      if (response.data.id === 0) {
        toast.error("The email is incorrect, no corresponding user.");
      } else {
        let data: messageModel = {
          sender: contacts.sender,
          receiverID: response.data.userId,
          content: contacts.content,
          type: 0,
        };
        //dispatch(addContacts(contacts));
        console.log(data, response);
      }
    } else if (response.status === 401) {
      toast.error(response.data.msg);
    } else {
      toast.error(response.data.message);
    }*/
    console.log(contacts);
  };
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
      dispatch(getChannels(authUser.id.toString()));
    }
  }, [dispatch, isChannelCreated, authUser]);

  /*
  select chat handeling :
    get conversations
    get chat user details
  */

  const onSelectChat = (id: string | number, isChannel?: boolean) => {
    if (isChannel) {
      dispatch(getChannelDetails(id));
    } else {
      dispatch(getChatUserDetails(id));
    }
    dispatch(readConversation(id));
    dispatch(getChatUserConversations(id));
    dispatch(changeSelectedChat(id));
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
      dispatch(getChannels(authUser.id.toString()));
      dispatch(getChatUserDetails(chatUserDetails.id));
    }
  }, [dispatch, isContactArchiveToggled, chatUserDetails.id, authUser]);

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
              {/* favourite */}
              <Favourites
                users={favourites}
                selectedChat={selectedChat}
                onSelectChat={onSelectChat}
              />

              {/* direct messages */}
              <DirectMessages
                users={directMessages}
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
          founderId={authUser.id}
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
          user={authUser}
          isOpen={isOpenNewMessage}
          onClose={closeNewMessageModal}
          onCreateNewMessage={onCreateNewMessage}
        />
      )}
    </>
  );
};

export default Index;
