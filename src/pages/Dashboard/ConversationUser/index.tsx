import React, { useEffect, useState } from "react";

// hooks
import { useRedux } from "../../../hooks/index";

// actions
import {
  toggleUserDetailsTab,
  getChatUserConversations,
  onSendMessage,
  receiveMessage,
  readMessage,
  receiveMessageFromUser,
  deleteMessage,
  deleteUserMessages,
  toggleArchiveContact,
} from "../../../redux/actions";

// hooks
import { useProfile } from "../../../hooks";

// components
import UserHead from "./UserHead";
import Conversation from "./Conversation";
import ChatInputSection from "./ChatInputSection/index";

// interface
import { MessagesTypes } from "../../../data/messages";
import { messageModel, recentChatUserModel } from "../../../redux/chats/types";

// dummy data
import { pinnedTabs } from "../../../data/index";

interface IndexProps {
  isChannel: boolean;
}
const Index = ({ isChannel }: IndexProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  const {
    selectedChatInfo, // 用途可能跟chatUserDetails重複
    chatUserDetails,
    chatUserConversations,
    isUserMessageSent,
    isMessageDeleted,
    isMessageForwarded,
    isUserMessagesDeleted,
    isImageDeleted,
    recentChatUsers,
  } = useAppSelector(state => ({
    selectedChatInfo: state.Chats.selectedChatInfo,
    chatUserDetails: state.Chats.chatUserDetails,
    chatUserConversations: state.Chats.chatUserConversations,
    isUserMessageSent: state.Chats.isUserMessageSent,
    isMessageDeleted: state.Chats.isMessageDeleted,
    isMessageForwarded: state.Chats.isMessageForwarded,
    isUserMessagesDeleted: state.Chats.isUserMessagesDeleted,
    isImageDeleted: state.Chats.isImageDeleted,
    recentChatUsers: state.Chats.recentChatUsers,
  }));
  const onOpenUserDetails = () => {
    dispatch(toggleUserDetailsTab(true));
  };

  /*
  hooks
  */
  const { userProfile } = useProfile();

  /*
  reply handeling
  */
  const [replyData, setReplyData] = useState<
    null | MessagesTypes | undefined
  >();
  const onSetReplyData = (reply: null | MessagesTypes | undefined) => {
    setReplyData(reply);
  };

  /*
  send message
  */
  const onSend = (data: messageModel) => {
    /*let params: any = {
      text: data.text && data.text,
      time: new Date().toISOString(),
      image: data.image && data.image,
      attachments: data.attachments && data.attachments,
      meta: {
        receiver: chatUserDetails.id,
        sender: userProfile.uid,
      },
    };
    if (replyData && replyData !== null) {
      params["replyOf"] = replyData;
    }*/

    dispatch(onSendMessage(data));
    setReplyData(null);
  };

  useEffect(() => {
    if (
      isUserMessageSent ||
      isMessageDeleted ||
      isMessageForwarded ||
      isUserMessagesDeleted ||
      isImageDeleted
    ) {
      //dispatch(getChatUserConversations(chatUserDetails.id));
    }
  }, [
    dispatch,
    isUserMessageSent,
    chatUserDetails,
    isMessageDeleted,
    isMessageForwarded,
    isUserMessagesDeleted,
    isImageDeleted,
  ]);

  useEffect(() => {
    if (selectedChatInfo) {
      dispatch(
        getChatUserConversations({
          otherSideID: selectedChatInfo.id,
          lastMessageID: recentChatUsers.find(
            (item: recentChatUserModel) =>
              item.User1 === selectedChatInfo.id ||
              item.User2 === selectedChatInfo.id
          ).Messages[0].ID,
          n: 50,
        })
      );
    }
  }, [dispatch, selectedChatInfo, userProfile]);

  const onDeleteMessage = (messageId: string | number) => {
    dispatch(deleteMessage(chatUserDetails.id, messageId));
  };

  const onDeleteUserMessages = () => {
    dispatch(deleteUserMessages(chatUserDetails.id));
  };

  const onToggleArchive = () => {
    dispatch(toggleArchiveContact(chatUserDetails.id));
  };

  return (
    <>
      <UserHead
        chatUserDetails={selectedChatInfo}
        pinnedTabs={pinnedTabs}
        onOpenUserDetails={onOpenUserDetails}
        onDelete={onDeleteUserMessages}
        isChannel={isChannel}
        onToggleArchive={onToggleArchive}
      />
      {chatUserConversations.length > 0 && (
        <Conversation
          chatUserConversations={chatUserConversations}
          chatUserDetails={selectedChatInfo}
          onDelete={onDeleteMessage}
          onSetReplyData={onSetReplyData}
          isChannel={isChannel}
        />
      )}
      <ChatInputSection
        onSend={onSend}
        replyData={replyData}
        onSetReplyData={onSetReplyData}
        selectedChatInfo={selectedChatInfo}
      />
    </>
  );
};

export default Index;
