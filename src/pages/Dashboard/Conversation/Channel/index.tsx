import React, { useEffect, useState } from "react";

// hooks
import { useRedux } from "../../../../hooks/index";

// actions
import {
  toggleUserDetailsTab,
  getChatUserConversations,
  getChannelPosts,
  onSendMessage,
  receiveMessage,
  readMessage,
  receiveMessageFromUser,
  deleteMessage,
  deleteUserMessages,
  toggleArchiveContact,
  uploadMessageFile,
  downloadMessageFile,
} from "../../../../redux/actions";

// hooks
import { useProfile } from "../../../../hooks";

// components
import UserHead from "./UserHead";
import Home from "./Home";
import ChatInputSection from "../Shared/ChatInputSection/index";

// interface
import { MessagesTypes } from "../../../../data/messages";
import {
  messageModel,
  MessageTypeEnum,
  channelModel,
} from "../../../../redux/chats/types";

// dummy data
import { pinnedTabs } from "../../../../data/index";

interface IndexProps {}

const Index = () => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  const {
    selectedChatInfo, // 用途可能跟chatUserDetails重複
    chatUserDetails,
    chatUserConversations,
    channelPosts,
    isUserMessageSent,
    isMessageDeleted,
    isMessageForwarded,
    isUserMessagesDeleted,
    isImageDeleted,
    recentChatChannels,
    messageID,
  } = useAppSelector(state => ({
    selectedChatInfo: state.Chats.selectedChatInfo,
    chatUserDetails: state.Chats.chatUserDetails,
    chatUserConversations: state.Chats.chatUserConversations,
    channelPosts: state.Chats.channelPosts,
    isUserMessageSent: state.Chats.isUserMessageSent,
    isMessageDeleted: state.Chats.isMessageDeleted,
    isMessageForwarded: state.Chats.isMessageForwarded,
    isUserMessagesDeleted: state.Chats.isUserMessagesDeleted,
    isImageDeleted: state.Chats.isImageDeleted,
    recentChatChannels: state.Chats.channels,
    messageID: state.Chats.messageID,
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

  const onUpload = (file: any) => {
    let data = {
      receiverID: selectedChatInfo.id,
      type: MessageTypeEnum.file,
      file: file,
    };
    dispatch(uploadMessageFile(data));
  };
  
  const onDownload = (messageID: string | number, filename: string) => {
    let data = {
      messageID: messageID
    }
    dispatch(downloadMessageFile(filename, data))
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
      // 回傳的是不包含該筆id的紀錄，所以+1
      dispatch(
        getChannelPosts({
          ID: selectedChatInfo.id,
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
        isChannel={true}
        onToggleArchive={onToggleArchive}
      />
      <ChatInputSection
        onSend={onSend}
        onUpload={onUpload}
        replyData={replyData}
        onSetReplyData={onSetReplyData}
        selectedChatInfo={selectedChatInfo}
      />
      <Home
        chatUserConversations={chatUserConversations}
        chatUserDetails={selectedChatInfo}
        channelPosts={channelPosts}
        onDelete={onDeleteMessage}
        onSetReplyData={onSetReplyData}
        onDownload={onDownload}
        isChannel={true}
      />
    </>
  );
};

export default Index;
