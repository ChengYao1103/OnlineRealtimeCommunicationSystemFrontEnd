import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { useProfile } from "../hooks";

interface MeetingModalProps {
  meetingId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ChannelMeetingModal = ({
  isOpen,
  meetingId,
  onClose,
}: MeetingModalProps) => {
  const { userProfile } = useProfile();

  const leaveMeeting = () => {
    var iframe = document.getElementById("meetingIframe") as HTMLIFrameElement;
    iframe.src = "";
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      tabIndex={-1}
      centered
      className="channelMeetingModal"
      contentClassName="shadow-lg border-0"
    >
      <ModalBody className="d-flex align-items-stretch">
        <div style={{ width: "100%" }}>
          <iframe
            id="meetingIframe"
            src={`https://meet.beeenson.com:8443?name=${userProfile.name}&roomName=${meetingId}`}
            width="100%"
            title="group meeting"
            allow="camera;microphone"
            scrolling="no"
            style={{ borderRadius: "5px", height: "100%" }}
          ></iframe>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button type="button" className="btn btn-danger" onClick={leaveMeeting}>
          離開會議
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ChannelMeetingModal;
