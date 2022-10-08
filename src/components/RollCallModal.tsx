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
import { useRedux } from "../hooks";
import { getRollCall } from "../redux/actions";

interface InviteContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const RollCallModal = ({ isOpen, onClose }: InviteContactModalProps) => {
  const { dispatch, useAppSelector } = useRedux();
  const { channelInfo, rollCall } = useAppSelector(state => ({
    channelInfo: state.Chats.selectedChatInfo,
    rollCall: state.Chats.rollCall,
  }));

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const onLoad = () => {
    dispatch(getRollCall(channelInfo.id));
  };

  useEffect(() => {
    if (rollCall) {
      if (new Date(rollCall.startTime).toISOString() != "Invalid Date")
        setStartTime(new Date(rollCall.startTime).toLocaleString());
      else setStartTime(" ");
      if (new Date(rollCall.end).toLocaleString() != "Invalid Date")
        setEndTime(new Date(rollCall.end).toLocaleString());
      else setEndTime(" ");
    }
  }, [rollCall]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      onOpened={onLoad}
      tabIndex={-1}
      centered
      scrollable
    >
      <ModalHeader className="modal-title-custom" toggle={onClose}>
        建立點名
      </ModalHeader>
      <ModalBody className="p-4">
        <Form>
          <div className="mb-3">
            <Label htmlFor="RollCallStartTime-input" className="form-label">
              開始時間:
            </Label>
            <Input
              type="datetime"
              className="form-control mb-3"
              id="RollCallStartTime-input"
              placeholder="Choose start time"
              value={startTime}
              disabled={true}
              onChange={(e: any) => {
                setStartTime(e.target.value);
              }}
            />
            <Label htmlFor="RollCallEndTime-input" className="form-label">
              結束時間(選填):
            </Label>
            <Input
              type="datetime"
              className="form-control mb-3"
              id="RollCallEndTime-input"
              placeholder="Choose end time (optional)"
              value={endTime}
              disabled={true}
              onChange={(e: any) => {
                console.log(e.target.value);
                if (!Date.parse(e.target.value)) setEndTime("");
                else setEndTime(e.target.value);
              }}
            ></Input>
          </div>
        </Form>
      </ModalBody>
      <Button color="primary" className="m-3">
        開始點名
      </Button>
    </Modal>
  );
};

export default RollCallModal;
