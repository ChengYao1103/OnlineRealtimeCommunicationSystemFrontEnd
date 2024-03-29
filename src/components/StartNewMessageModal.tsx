import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
} from "reactstrap";

/* interface */
interface StartNewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNewMessage: (data: any) => void;
}
export interface DataTypes {
  email: string | null;
  content: string | null;
}

const StartNewMessageModal = ({
  isOpen,
  onClose,
  onCreateNewMessage: onInvite,
}: StartNewMessageModalProps) => {
  /*
  data input handeling
  */
  const [data, setData] = useState<DataTypes>({
    email: null,
    content: null,
  });
  useEffect(() => {
    setData({
      email: null,
      content: null,
    });
  }, []);

  const onChangeData = (field: "email" | "content", value: string) => {
    let modifiedData: DataTypes = { ...data };
    if (value === "") {
      modifiedData[field] = null;
    } else {
      modifiedData[field] = value;
    }
    setData(modifiedData);
  };

  /*
  validation
  */
  const [valid, setValid] = useState<boolean>(false);
  useEffect(() => {
    if (data.email !== null && data.content !== null) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [data]);
  return (
    <Modal isOpen={isOpen} toggle={onClose} tabIndex={-1} centered scrollable>
      <ModalHeader className="modal-title-custom" toggle={onClose}>
        傳送新訊息
      </ModalHeader>
      <ModalBody className="p-4">
        <Form>
          <div className="mb-3">
            <Label htmlFor="AddContactModalemail-input" className="form-label">
              收訊人Email
            </Label>
            <Input
              type="email"
              className="form-control"
              id="AddContactModalemail-input"
              placeholder="Enter Email"
              value={data["email"] || ""}
              onChange={(e: any) => {
                onChangeData("email", e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <Label
              htmlFor="AddContactModal-invitemessage-input"
              className="form-label"
            >
              訊息
            </Label>
            <textarea
              value={data["content"] || ""}
              onChange={(e: any) => {
                onChangeData("content", e.target.value);
              }}
              className="form-control"
              id="AddContactModal-invitemessage-input"
              rows={3}
              placeholder="Enter Message"
            ></textarea>
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" color="link" className="btn" onClick={onClose}>
          取消
        </Button>
        <Button
          type="button"
          color="primary"
          disabled={!valid}
          onClick={() => onInvite(data)}
        >
          送出
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default StartNewMessageModal;
