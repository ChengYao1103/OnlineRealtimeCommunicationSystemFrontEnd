import React, { useState } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";

// components
import LightBox from "../../../components/LightBox";

//images
import imagePlaceholder from "../../../assets/images/users/profile-placeholder.png";

// interface
import {
  MessagesTypes,
  ImageTypes,
  AttachmentTypes,
} from "../../../data/messages";
import { userModel } from "../../../redux/auth/types";
import {
  channelModel,
  messageRecordModel,
  MessageTypeEnum,
} from "../../../redux/chats/types";

// hooks
import { useProfile } from "../../../hooks";

// utils
import { getDateTime } from "../../../utils";
import RepliedMessage from "./RepliedMessage";

interface MenuProps {
  onDelete: () => any;
  onReply: () => any;
  onForward: () => void;
}

const Menu = ({ onDelete, onReply, onForward }: MenuProps) => {
  return (
    <UncontrolledDropdown className="align-self-start message-box-drop">
      <DropdownToggle className="btn btn-toggle" role="button" tag={"a"}>
        <i className="ri-more-2-fill"></i>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          to="#"
          onClick={onReply}
        >
          Reply <i className="bx bx-share ms-2 text-muted"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          to="#"
          onClick={onForward}
        >
          Forward <i className="bx bx-share-alt ms-2 text-muted"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          to="#"
        >
          Copy <i className="bx bx-copy text-muted ms-2"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          to="#"
        >
          Bookmark <i className="bx bx-bookmarks text-muted ms-2"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between"
          to="#"
        >
          Mark as Unread <i className="bx bx-message-error text-muted ms-2"></i>
        </DropdownItem>
        <DropdownItem
          className="d-flex align-items-center justify-content-between delete-item"
          onClick={onDelete}
        >
          Delete <i className="bx bx-trash text-muted ms-2"></i>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};
interface ImageMoreMenuProps {
  onDelete: () => void;
}
const ImageMoreMenu = ({ onDelete }: ImageMoreMenuProps) => {
  return (
    <div className="message-img-link">
      <ul className="list-inline mb-0">
        <UncontrolledDropdown
          tag="li"
          color="none"
          className="list-inline-item dropdown"
        >
          <DropdownToggle tag="a" role="button" className="btn btn-toggle">
            <i className="bx bx-dots-horizontal-rounded"></i>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              className=" d-flex align-items-center justify-content-between"
              to="#"
            >
              Download <i className="bx bx-download ms-2 text-muted"></i>
            </DropdownItem>
            <DropdownItem
              className=" d-flex align-items-center justify-content-between"
              to="#"
              data-bs-toggle="collapse"
              data-bs-target=".replyCollapse"
            >
              Reply <i className="bx bx-share ms-2 text-muted"></i>
            </DropdownItem>
            <DropdownItem
              className=" d-flex align-items-center justify-content-between"
              to="#"
              data-bs-toggle="modal"
              data-bs-target=".forwardModal"
            >
              Forward <i className="bx bx-share-alt ms-2 text-muted"></i>
            </DropdownItem>
            <DropdownItem
              className=" d-flex align-items-center justify-content-between"
              to="#"
            >
              Bookmark <i className="bx bx-bookmarks text-muted ms-2"></i>
            </DropdownItem>
            <DropdownItem
              className=" d-flex align-items-center justify-content-between delete-item"
              to="#"
              onClick={onDelete}
            >
              Delete <i className="bx bx-trash ms-2 text-muted"></i>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </ul>
    </div>
  );
};

interface ImageProps {
  image: ImageTypes;
  onImageClick: (id: number) => void;
  index: number;
  onDeleteImg: (imageId: string | number) => void;
}
const Image = ({ image, onImageClick, index, onDeleteImg }: ImageProps) => {
  const onDelete = () => {
    onDeleteImg(image.id);
  };
  return (
    <div className="message-img-list">
      <div>
        <Link
          className="popup-img d-inline-block"
          to={"#"}
          onClick={() => onImageClick(index)}
        >
          <img src={image.downloadLink} alt="" className="rounded border" />
        </Link>
      </div>
      <ImageMoreMenu onDelete={onDelete} />
    </div>
  );
};
interface ImagesProps {
  images: ImageTypes[];
  onDeleteImg: (imageId: string | number) => void;
}
const Images = ({ images, onDeleteImg }: ImagesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const onImageClick = (id: number) => {
    setSelected(id);
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="message-img mb-0">
        {(images || []).map((image: ImageTypes, key: number) => (
          <Image
            image={image}
            key={key}
            index={key}
            onImageClick={onImageClick}
            onDeleteImg={onDeleteImg}
          />
        ))}
      </div>
      {isOpen && (
        <LightBox
          isOpen={isOpen}
          images={images}
          onClose={onClose}
          defaultIdx={selected}
        />
      )}
    </>
  );
};

interface AttachmentsProps {
  attachments: AttachmentTypes[] | undefined;
}
const Attachments = ({ attachments }: AttachmentsProps) => {
  return (
    <>
      {(attachments || []).map((attachment: AttachmentTypes, key: number) => (
        <div
          key={key}
          className={classnames("p-3", "border-primary", "border rounded-3", {
            "mt-2": key !== 0,
          })}
        >
          <div className="d-flex align-items-center attached-file">
            <div className="flex-shrink-0 avatar-sm me-3 ms-0 attached-file-avatar">
              <div className="avatar-title bg-soft-primary text-primary rounded-circle font-size-20">
                <i className="ri-attachment-2"></i>
              </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
              <div className="text-start">
                <h5 className="font-size-14 mb-1">{attachment.name}</h5>
                <p className="text-muted text-truncate font-size-13 mb-0">
                  {attachment.desc}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 ms-4">
              <div className="d-flex gap-2 font-size-20 d-flex align-items-start">
                <div>
                  <Link
                    to={attachment.downloadLink ? attachment.downloadLink : "#"}
                    className="text-muted"
                  >
                    <i className="bx bxs-download"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const Typing = () => {
  return (
    <p className="mb-0">
      typing
      <span className="animate-typing">
        <span className="dot mx-1"></span>
        <span className="dot me-1"></span>
        <span className="dot"></span>
      </span>
    </p>
  );
};
interface MessageProps {
  message: messageRecordModel;
  chatUserDetails: userModel;
  onDelete: (messageId: string | number) => any;
  onSetReplyData: (reply: null | MessagesTypes | undefined) => void;
  isFromMe: boolean;
  onOpenForward: (message: MessagesTypes) => void;
  isChannel: boolean;
  onDeleteImage: (messageId: string | number, imageId: string | number) => void;
}
const Message = ({
  message,
  chatUserDetails,
  onDelete,
  onSetReplyData,
  isFromMe,
  onOpenForward,
  isChannel,
  onDeleteImage,
}: MessageProps) => {
  const { userProfile } = useProfile();
  const hasText = message.Type === MessageTypeEnum.text;
  const hasImages = message.Type === MessageTypeEnum.image;
  const hasAttachments = message.Type === MessageTypeEnum.file;
  const hasCallingInfo = message.Type === MessageTypeEnum.callRecord;
  const isTyping = false;

  const chatUserFullName = chatUserDetails.name;

  const myProfile = userProfile.photo ? userProfile.photo : imagePlaceholder;
  const channeluserProfile = imagePlaceholder;
  /*message.meta.userData && message.meta.userData.profileImage
      ? message.meta.userData.profileImage
      : imagePlaceholder;*/
  const chatUserprofile = chatUserDetails.photo
    ? chatUserDetails.photo
    : imagePlaceholder;
  const profile = isChannel ? channeluserProfile : chatUserprofile;
  const date = getDateTime(message.Time);
  const isSent = true; //message.meta.sent;
  const isReceived = true; //message.meta.received;
  const isRead = false; //message.meta.read;
  const isForwarded = false; //message.meta.isForwarded;
  const channelSenderFullname = "-";
  /*message.meta.userData
    ? `${message.meta.userData.firstName} ${message.meta.userData.lastName}`
    : "-";*/
  const ChatUserfullName = isChannel ? channelSenderFullname : chatUserFullName;
  const onDeleteMessage = () => {
    //onDelete(message.mId);
  };

  const onClickReply = () => {
    //onSetReplyData(message);
  };
  const isRepliedMessage = false; //message.replyOf;

  const onForwardMessage = () => {
    //onOpenForward(message);
  };

  const onDeleteImg = (imageId: number | string) => {
    //onDeleteImage(message.mId, imageId);
  };
  return (
    <li
      className={classnames(
        "chat-list",
        { right: isFromMe },
        { reply: isRepliedMessage }
      )}
    >
      <div className="conversation-list">
        <div className="chat-avatar">
          <img src={isFromMe ? myProfile : profile} alt="" />
        </div>

        <div className="user-chat-content">
          {/*hasImages && message.Content && (
            <div className="ctext-wrap">
              <div className="ctext-wrap-content">
                <p className="mb-0 ctext-content">{message.Content}</p>
              </div>
            </div>
          )*/}
          {isForwarded && (
            <span
              className={classnames(
                "me-1",
                "text-muted",
                "font-size-13",
                "mb-1",
                "d-block"
              )}
            >
              <i
                className={classnames(
                  "ri",
                  "ri-share-forward-line",
                  "align-middle",
                  "me-1"
                )}
              ></i>
              Forwarded
            </span>
          )}

          <div className="ctext-wrap">
            {/* text message end */}

            {/* image message start */}
            {hasImages && message.Content.substring(0, 10) === "data:image" ? (
              <>
                {/* <Images images={message.Content!} onDeleteImg={onDeleteImg} />*/}
                <div className="ctext-wrap-content">
                  <img src={message.Content} alt="imageMessage"></img>
                </div>
              </>
            ) : (
              <>
                <div
                  className="ctext-wrap-content text-start"
                  style={{ display: "inline-block", wordBreak: "break-word" }}
                >
                  {/*isRepliedMessage && (
                    <RepliedMessage
                      fullName={fullName}
                      message={message}
                      isFromMe={isFromMe}
                    />
                  )*/}

                  {hasText && (
                    <p className="mb-0 ctext-content">{message.Content}</p>
                  )}

                  {/* typing start */}
                  {isTyping && <Typing />}
                  {/* typing end */}

                  {/* files message start */}
                  {hasAttachments && (
                    <Attachments attachments={message.Content} />
                  )}
                  {/* files message end */}

                  {/* calling info start */}
                  {hasCallingInfo && (
                    <p className="mb-0 ctext-content text-secondary">
                      {isFromMe ? "您" : "對方"}結束了一次通話
                    </p>
                  )}
                  {/* calling info end */}
                </div>
                <Menu
                  onForward={onForwardMessage}
                  onDelete={onDeleteMessage}
                  onReply={onClickReply}
                />
              </>
            )}

            {/* image message end */}
          </div>
          <div className="conversation-name">
            {isFromMe ? (
              <>
                <span
                  className={classnames(
                    "me-1",
                    { "text-success": isRead },
                    { "text-muted": (isSent || isReceived) && !isRead }
                  )}
                >
                  <i
                    className={classnames(
                      "bx",
                      { "bx-check-double": isRead || isReceived },
                      { "bx-check": isSent }
                    )}
                  ></i>
                </span>
                <small className={classnames("text-muted", "mb-0", "me-2")}>
                  {date}
                </small>
                You
              </>
            ) : (
              <>
                {ChatUserfullName}
                <small className={classnames("text-muted", "mb-0", "ms-2")}>
                  {date}
                </small>
              </>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default Message;
