import React, { useEffect, useState } from "react";
import { Alert, Form } from "reactstrap";

// components
import StartButtons from "../Shared/ChatInputSection/StartButtons";
import InputSection from "../Shared/ChatInputSection/InputSection";
import EndButtons from "../Shared/ChatInputSection/EndButtons";
import MoreMenu from "../Shared/ChatInputSection/MoreMenu";
import Reply from "../Shared/ChatInputSection/Reply";

// interface
import { MessagesTypes } from "../../../../data/messages";
import { userModel } from "../../../../redux/auth/types";
import { MessageTypeEnum } from "../../../../redux/chats/types";
import { toast } from "react-toastify";
import { sendMessage } from "../../../../api";
import { createPost } from "../../../../redux/actions";
import { useRedux } from "../../../../hooks/useRedux";

interface IndexProps {
  onSend: (data: any) => void;
  onUpload: (file: any) => void;
  replyData: null | MessagesTypes | undefined;
  onSetReplyData: (reply: null | MessagesTypes | undefined) => void;
  selectedChatInfo: userModel;
}
const PostInputSection = ({
  onSend,
  onUpload,
  replyData,
  onSetReplyData,
  selectedChatInfo,
}: IndexProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();
  /*
  more menu collapse
  */
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  /*
  disable send button
  */
  const [disabled, setDisabled] = useState<boolean>(true);

  /*
  input text
  */
  const [text, setText] = useState<string>("");
  const onChangeText = (value: string) => {
    setText(value);
  };

  /*
  images
  */
  const [images, setImages] = useState<Array<any>>([]);
  const onSelectImages = (images: Array<any>) => {
    setImages(images);
  };

  /*
  files
  */
  const [files, setFiles] = useState<Array<any>>([]);
  const onSelectFiles = (files: Array<any>) => {
    setFiles(files);
    console.log(files);
  };
  useEffect(() => {
    if (text !== "" || images.length > 0 || files.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [text, images, files]);

  const onSubmit = () => {
    // text message
    if (text.length > 0) {
      dispatch(
        createPost({
          channelID: selectedChatInfo.id,
          content: text,
        })
      );
    }

    // images message
    for (const image of images) {
      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        //發送轉換完成之圖片
        const base64 = reader.result;
        if (typeof base64 === "string") {
          onSend({
            receiverID: selectedChatInfo.id,
            content: base64,
            type: MessageTypeEnum.image,
          });
        }
      };
    }

    /*let data: any = {};
    if (text) {
      data["text"] = text;
    }
    if (images && images.length) {
      const imgs = (images || []).map((i: any, key: number) => {
        const src = URL.createObjectURL(i);
        return {
          id: key + 1,
          downloadLink: src,
        };
      });
      data["image"] = imgs;
    }*/

    // files message
    for (const file of files) {
      console.log(file.name);
      // onSend({
      //   receiverID: selectedChatInfo.id,
      //   content: file.name,
      //   type: MessageTypeEnum.file,
      // });
      onUpload(file);
      //console.log(file.name)
    }

    /*if (files && files.length) {
      const fs = (files || []).map((f: any, key: number) => {
        const src = URL.createObjectURL(f);
        return {
          id: key + 1,
          name: f.name,
          downloadLink: src,
          desc: f.size,
        };
      });
      data["attachments"] = fs;
    }*/

    /*if (datas.length === images.length + files.length + (text === "" ? 0 : 1)) {
      
    }*/
    setText("");
    setImages([]);
    setFiles([]);
  };

  const onClearMedia = () => {
    setImages([]);
    setFiles([]);
  };
  return (
    <div className="chat-input-section p-3 p-lg-4">
      <Form
        id="chatinput-form"
        onSubmit={(e: any) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="row g-0 align-items-center">
          <div className="col-auto">
            {/* <StartButtons
              onToggle={onToggle}
              text={text}
              onChange={onChangeText}
            /> */}
          </div>
          <div className="col">
            <InputSection value={text} onChange={onChangeText} />
          </div>
          <div className="col-auto">
            <EndButtons onSubmit={onSubmit} disabled={disabled} />
          </div>
        </div>
      </Form>

      {(images && images.length) || (files && files.length) ? (
        <Alert
          isOpen={true}
          toggle={onClearMedia}
          color="secondary"
          className="alert-dismiss-custom 
        rounded-pill font-size-12 mb-1 selected-media"
          closeClassName="selected-media-close"
        >
          <p className="me-2 mb-0">
            {images.length > 0 &&
              files.length === 0 &&
              ` You have selected ${images.length} images`}
            {files.length > 0 &&
              images.length === 0 &&
              ` You have selected ${files.length} files`}
            {files.length > 0 &&
              images.length > 0 &&
              ` You have selected ${files.length} files & ${images.length} images.`}
          </p>
        </Alert>
      ) : null}

      {/* <MoreMenu
        isOpen={isOpen}
        onSelectImages={onSelectImages}
        onSelectFiles={onSelectFiles}
        onToggle={onToggle}
      /> */}

      <Reply
        reply={replyData}
        onSetReplyData={onSetReplyData}
        chatUserDetails={selectedChatInfo}
      />
    </div>
  );
};

export default PostInputSection;
