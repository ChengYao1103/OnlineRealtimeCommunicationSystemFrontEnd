import React, { useEffect, useRef, useCallback, useState } from "react";

// hooks
import { useProfile, useRedux } from "../../../../hooks/index";

// components
import AppSimpleBar from "../../../../components/AppSimpleBar";
import Loader from "../../../../components/Loader";
import Post from "./Post";
// import Day from "./Day";

// interface
import { MessagesTypes } from "../../../../data/messages";
import { userModel } from "../../../../redux/auth/types";
import {
  messageRecordModel,
  channelPostModel,
} from "../../../../redux/chats/types";
import ForwardModal from "../../../../components/ForwardModal";

// actions
import {
  forwardMessage,
  deleteImage,
  getChatUserConversations,
  getChannelPosts,
} from "../../../../redux/actions";

interface ConversationProps {
  chatUserConversations: Array<messageRecordModel>;
  channelPosts: Array<channelPostModel>;
  chatUserDetails: userModel;
  onDelete: (messageId: string | number) => any;
  onSetReplyData: (reply: null | MessagesTypes | undefined) => void;
  onDownload: (messageID: string | number, filename: string) => any;
  isChannel: boolean;
}
const Conversation = ({
  chatUserDetails,
  chatUserConversations,
  channelPosts,
  onDelete,
  onSetReplyData,
  onDownload,
  isChannel,
}: ConversationProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();
  const { getChannelPostsLoading, isMessageForwarded } = useAppSelector(
    (state: any) => ({
      getChannelPostsLoading: state.Chats.getChannelPostsLoading,
      isMessageForwarded: state.Chats.isMessageForwarded,
    })
  );

  const { userProfile } = useProfile();
  const [requestOldConversation, setRequestOldConversation] = useState(false);
  const [lastScrollHeight, setLastScrollHeight] = useState(0);

  const ref = useRef<any>();
  const scrollElement = useCallback(() => {
    if (ref && ref.current) {
      const listEle = document.getElementById("channel-post-list");
      const scrollElement = ref.current.getScrollElement();
      var offsetHeight = 0;
      // 打開聊天室、傳送訊息 => 捲動到底部
      if (listEle && !requestOldConversation) {
        offsetHeight = listEle.scrollHeight - window.innerHeight + 250;
      }
      // 取得舊訊息 => (相對位置)停留原位
      else if (listEle && requestOldConversation) {
        offsetHeight = listEle.scrollHeight - lastScrollHeight;
      }
      if (
        listEle &&
        offsetHeight &&
        lastScrollHeight !== listEle.scrollHeight
      ) {
        scrollElement.scrollTo({
          top: offsetHeight,
          behavior: requestOldConversation ? "auto" : "smooth",
        });
        setRequestOldConversation(false);
        setLastScrollHeight(listEle.scrollHeight);
      }
      // 捲動到頂部時觸發取得更多(20筆)訊息
      // scrollElement.onscroll = () => {
      //   if (lastScrollHeight > 0 && scrollElement.scrollTop === 0) {
      //     setRequestOldConversation(true);
      //     dispatch(
      //       getChatUserConversations({
      //         otherSideID: chatUserDetails.id,
      //         lastMessageID: chatUserConversations[0].ID,
      //         n: 20,
      //       })
      //     );
      //   }
      // };
    }
  }, [
    lastScrollHeight,
    requestOldConversation,
    dispatch,
    chatUserDetails,
    chatUserConversations,
  ]);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.recalculate();
    }
  }, []);
  useEffect(() => {
    if (!getChannelPostsLoading && channelPosts.length > 0) {
      scrollElement();
    }
  }, [getChannelPostsLoading, channelPosts.length, scrollElement]);

  useEffect(() => {
    setRequestOldConversation(false);
    setLastScrollHeight(0);
  }, [chatUserDetails]);

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
      {getChannelPostsLoading && <Loader />}
      <ul
        className="list-unstyled chat-conversation-list"
        id="channel-post-list"
      >
        {(channelPosts || []).map((post: channelPostModel, key: number) => {
          //const isFromMe = conversation.SenderID === userProfile.id;
          return (
            <Post
              message={post}
              key={key}
              chatUserDetails={chatUserDetails}
              channelPost={post}
              onDelete={onDelete}
              onSetReplyData={onSetReplyData}
              onDownload={onDownload}
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
