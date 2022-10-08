import React, { useEffect, useState } from "react";
import {
  CardBody,
  CardTitle,
  CardText,
  ListGroup,
  Card,
  ListGroupItem,
  Input,
  Button,
} from "reactstrap";
import classnames from "classnames";

//images
import imagePlaceholder from "../../../../assets/images/users/profile-placeholder.png";

// interface
import { MessagesTypes } from "../../../../data/messages";
import { userModel } from "../../../../redux/auth/types";
import {
  channelPostModel,
  postCommentModel,
} from "../../../../redux/chats/types";

// hooks
import { useRedux } from "../../../../hooks";

// utils
import { getDateTime } from "../../../../utils";

// actions
import { createComment, getPostComments } from "../../../../redux/actions";
import Loader from "../../../../components/Loader";
import EndButtons from "../Shared/ChatInputSection/EndButtons";

interface MessageProps {
  message: channelPostModel;
  chatUserDetails: userModel;
  channelPost: channelPostModel;
  onDelete: (messageId: string | number) => any;
  onSetReplyData: (reply: null | MessagesTypes | undefined) => void;
  onDownload: (messageID: string | number, filename: string) => any;
  onOpenForward: (message: MessagesTypes) => void;
  isChannel: boolean;
  onDeleteImage: (messageId: string | number, imageId: string | number) => void;
}

// const Comment = ({

// return (
//   <ListGroup flush>
//   {([]).map(
//     (comment: postCommentModel, key: number) => {
//       console.log(comment)
//       return (
//         <ListGroupItem key={key}>
//           {comment.content}
//         </ListGroupItem>
//       );
//     })
//   }
//   </ListGroup>
// )

// })

const Post = ({
  message,
  chatUserDetails,
  channelPost,
  isChannel,
}: MessageProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();
  const { getPostCommentsLoading, postComments } = useAppSelector(state => ({
    getPostCommentsLoading: state.Chats.getPostCommentsLoading,
    postComments: state.Chats.postComments,
  }));
  const [comments, setComments] = useState([]);
  const [inputText, setInputText] = useState("");
  const channeluserProfile = imagePlaceholder;
  const chatUserprofile = chatUserDetails.photo
    ? chatUserDetails.photo
    : imagePlaceholder;
  const profile = isChannel ? channeluserProfile : chatUserprofile;
  const date = getDateTime(message.timestamp);

  const onLoadComment = () => {
    if (channelPost.id) {
      dispatch(getPostComments(channelPost.id));
    }
  };

  useEffect(() => {
    if (postComments.length > 0) {
      if (postComments[0].postID === channelPost.id) {
        setComments(postComments);
      }
    }
  }, [postComments]);

  return (
    <li
      className="chat-list"
      style={{
        width: "100%",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <div
        className="conversation-list"
        style={{
          width: "100%",
          border: "1px solid black",
          borderRadius: "5px",
        }}
      >
        <Card
          style={{
            width: "100%",
            justifyContent: "center",
            display: "flex",
            margin: "0px",
          }}
          onLoad={onLoadComment}
        >
          {getPostCommentsLoading && <Loader />}
          <CardBody style={{ backgroundColor: "#c1c4c9" }}>
            <CardTitle tag="h5">
              <div className="chat-avatar">
                <img src={profile} alt="" />
              </div>
            </CardTitle>
            <CardText>{channelPost.content}</CardText>
            <small className={classnames("text-muted", "mb-0", "me-2")}>
              {date}
            </small>
          </CardBody>
          <ListGroup flush>
            {(comments || []).map((comment: postCommentModel, key: number) => {
              if (channelPost.id === comment.postID) {
                return (
                  <ListGroupItem key={key}>
                    <div className="chat-avatar">
                      <img src={profile} alt="" />
                    </div>
                    <CardText>{comment.content}</CardText>
                    <small className={classnames("text-muted", "mb-0", "me-2")}>
                      {getDateTime(comment.timestamp)}
                    </small>
                  </ListGroupItem>
                );
              }
            })}
            <ListGroupItem>
              <div className="row g-0 align-items-center">
                <div className="col me-3">
                  <Input
                    placeholder="輸入..."
                    onChange={e => setInputText(e.target.value)}
                  ></Input>
                </div>
                <div className="col-auto">
                  <Button
                    color="primary"
                    type="submit"
                    disabled={inputText.trim().length === 0}
                    onClick={() => {
                      dispatch(
                        createComment({
                          postID: channelPost.id,
                          content: inputText,
                        })
                      );
                    }}
                    className="btn btn-primary chat-send waves-effect waves-light"
                  >
                    <i className="bx bxs-send align-middle"></i>
                  </Button>
                </div>
              </div>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </div>
    </li>
  );
};

export default Post;
