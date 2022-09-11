import React, { useEffect, useRef, useCallback, useState } from "react";

// hooks
import { useRedux } from "../../../hooks/index";

// hooks
import { useProfile } from "../../../hooks";

// components
import AppSimpleBar from "../../../components/AppSimpleBar";
import Loader from "../../../components/Loader";
import Message from "./Message";
// import Day from "./Day";

// interface
import { MessagesTypes } from "../../../data/messages";
import { userModel } from "../../../redux/auth/types";
import ForwardModal from "../../../components/ForwardModal";

// actions
import {
  forwardMessage,
  deleteImage,
  getChatUserConversations,
} from "../../../redux/actions";
import { messageRecordModel } from "../../../redux/chats/types";

interface ConversationProps {
  chatUserConversations: Array<messageRecordModel>;
  chatUserDetails: userModel;
  onDelete: (messageId: string | number) => any;
  onSetReplyData: (reply: null | MessagesTypes | undefined) => void;
  isChannel: boolean;
}
const Conversation = ({
  chatUserDetails,
  chatUserConversations,
  onDelete,
  onSetReplyData,
  isChannel,
}: ConversationProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  const { userProfile } = useProfile();

  const { getUserConversationsLoading, isMessageForwarded } = useAppSelector(
    (state: any) => ({
      getUserConversationsLoading: state.Chats.getUserConversationsLoading,
      isMessageForwarded: state.Chats.isMessageForwarded,
    })
  );

  const messages = chatUserConversations ? chatUserConversations : [];

  const ref = useRef<any>();
  const scrollElement = useCallback(() => {
    if (ref && ref.current) {
      const listEle = document.getElementById("chat-conversation-list");
      const scrollElement = ref.current.getScrollElement();
      let offsetHeight = 0;
      if (listEle) {
        offsetHeight = listEle.scrollHeight - window.innerHeight + 250;
      }
      if (offsetHeight) {
        scrollElement.scrollTo({ top: offsetHeight, behavior: "smooth" });
      }
      // 捲動到頂部時觸發取得更多(20筆)訊息
      scrollElement.onscroll = () => {
        if (scrollElement.scrollTop === 0) {
          console.log(chatUserConversations[0]);
          dispatch(
            getChatUserConversations({
              otherSideID: chatUserDetails.id,
              lastMessageID: chatUserConversations[0].ID,
              n: 20,
            })
          );
        }
      };
    }
  }, [ref]);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.recalculate();
    }
  }, []);
  useEffect(() => {
    if (chatUserConversations) {
      scrollElement();
    }
  }, [chatUserConversations, chatUserConversations.length, scrollElement]);

  /*
  forward message
  */
  const [forwardData, setForwardData] = useState<
    null | MessagesTypes | undefined
  >();
  const [isOpenForward, setIsOpenForward] = useState<boolean>(false);
  const onOpenForward = (message: MessagesTypes) => {
    setForwardData(message);
    setIsOpenForward(true);
  };
  const onCloseForward = () => {
    setIsOpenForward(false);
  };

  const onForwardMessage = (data: any) => {
    const params = {
      contacts: data.contacts,
      message: data.message,
      forwardedMessage: forwardData,
    };
    dispatch(forwardMessage(params));
  };
  useEffect(() => {
    if (isMessageForwarded) {
      setIsOpenForward(false);
    }
  }, [isMessageForwarded]);

  /*
  image delete
  */
  const onDeleteImage = (
    messageId: string | number,
    imageId: string | number
  ) => {
    dispatch(deleteImage(chatUserDetails.id, messageId, imageId));
  };
  return (
    <AppSimpleBar
      scrollRef={ref}
      className="chat-conversation p-3 p-lg-4 positin-relative"
    >
      {getUserConversationsLoading && <Loader />}
      <ul
        className="list-unstyled chat-conversation-list"
        id="chat-conversation-list"
      >
        {(messages || []).map((message: messageRecordModel, key: number) => {
          const isFromMe = message.SenderID === userProfile.id;
          return (
            <Message
              message={message}
              key={key}
              chatUserDetails={chatUserDetails}
              onDelete={onDelete}
              onSetReplyData={onSetReplyData}
              isFromMe={isFromMe}
              onOpenForward={onOpenForward}
              isChannel={isChannel}
              onDeleteImage={onDeleteImage}
            />
          );
        })}
        {/*  <Day /> */}
      </ul>
      {isOpenForward && (
        <ForwardModal
          isOpen={isOpenForward}
          onClose={onCloseForward}
          forwardData={forwardData}
          chatUserDetails={chatUserDetails}
          onForward={onForwardMessage}
        />
      )}
    </AppSimpleBar>
  );
};

export default Conversation;
