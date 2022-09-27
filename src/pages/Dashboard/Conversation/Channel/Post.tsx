import React, { useEffect, useState } from "react";
import {
  CardBody,
  CardTitle,
  CardText,
  ListGroup,
  Card,
  ListGroupItem,
  Input,
} from "reactstrap";
import classnames from "classnames";

//images
import imagePlaceholder from "../../../../assets/images/users/profile-placeholder.png";

// interface
import {
  MessagesTypes,
} from "../../../../data/messages";
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
import {
  getPostComments
} from "../../../../redux/actions";
import Loader from "../../../../components/Loader";
import { createComment } from "../../../../api";

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
    postComments: state.Chats.postComments
  }))
  const [comments, setComments] = useState([])
  const [inputText, setInputText] = useState("")
  const channeluserProfile = imagePlaceholder;
  const chatUserprofile = chatUserDetails.photo
    ? chatUserDetails.photo
    : imagePlaceholder;
  const profile = isChannel ? channeluserProfile : chatUserprofile;
  const date = getDateTime(message.timestamp);

  const onLoadComment = () => {
    if (channelPost.id) {
      dispatch(getPostComments(channelPost.id))
    }
  }

  useEffect(() => {
    if (postComments.length > 0) {
      if (postComments[0].postID === channelPost.id) {
        setComments(postComments);
      }
    }
  }, [postComments]);


  return (
    <li className="chat-list">
      <div className="conversation-list">
        <Card
          style={{
            width: '100rem',
            justifyContent:'center',
            display: 'flex',
          }}
          onLoad={onLoadComment}
        >
        {getPostCommentsLoading && <Loader />}
          <CardBody>
            <CardTitle tag="h5">
              <div className="chat-avatar">
                <img src={profile} alt="" />
              </div>   
            </CardTitle>
            <CardText>
              {channelPost.content}
            </CardText>
            <small className={classnames("text-muted", "mb-0", "me-2")}>
              {date}
            </small>
          </CardBody>
          <ListGroup flush>
            {(comments || []).map(
              (comment: postCommentModel, key: number) => {
                if (channelPost.id == comment.postID) {
                  return (
                    <ListGroupItem key={key} color="primary">
                      <div  className="chat-avatar">
                        <img src={profile} alt="" />
                      </div>
                      <CardText>                    
                        {comment.content}
                      </CardText>
                      <small className={classnames("text-muted", "mb-0", "me-2")}>
                        {getDateTime(comment.timestamp)}
                      </small>
                    </ListGroupItem>
                  );
                }
              })
            }
            <ListGroupItem>
              <Input placeholder="Enter comment here" onChange={(e) => setInputText(e.target.value)}></Input>
              <button onClick={() => {dispatch(createComment({postID: channelPost.id, content: inputText}))}}>
                enter
              </button>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </div>
    </li>
    );
};

export default Post;
