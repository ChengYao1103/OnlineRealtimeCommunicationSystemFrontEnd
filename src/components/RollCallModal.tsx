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
    dispatch(getRollCall(channelInfo.id))
  }

  useEffect(() => {
    if (rollCall) {
      setStartTime(rollCall.startTime)
      if (!Date.parse(rollCall.endTime))
        setEndTime(rollCall.endTime)
      else
        setEndTime(" ")
    }
  }, [rollCall])

  return (
    <Modal isOpen={isOpen} toggle={onClose} onOpened={onLoad} tabIndex={-1} centered scrollable>
      <ModalHeader className="modal-title-custom" toggle={onClose}>
        Roll Call
      </ModalHeader>
      <ModalBody className="p-4">
        <Form>
          <div className="mb-3">
            <Label htmlFor="RollCallStartTime-input" className="form-label">
              Start Time:
            </Label>
            <Input
              type="datetime"
              className="form-control"
              id="RollCallStartTime-input"
              placeholder="Choose start time"
              value={startTime}
              disabled={true}
              onChange={(e: any) => {
                setStartTime(e.target.value);
              }}
            />
            <Label htmlFor="RollCallEndTime-input" className="form-label">
              End Time: 
            </Label>
            <Input
              type="datetime"
              className="form-control"
              id="RollCallEndTime-input"
              placeholder="Choose end time (optional)"
              value={endTime}
              disabled={true}
              onChange={(e: any) => {
                console.log(e.target.value)
                if (!Date.parse(e.target.value))
                  setEndTime("")
                else
                  setEndTime(e.target.value);
              }}
            >
            </Input>
          </div>
        </Form>
      </ModalBody>
            <Button>Sign In</Button>
      <ModalFooter>
        <Button type="button" color="link" className="btn" onClick={onClose}>
          Close
        </Button>
        <Button
          type="button"
          color="primary"
        >
          Invite
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RollCallModal;
