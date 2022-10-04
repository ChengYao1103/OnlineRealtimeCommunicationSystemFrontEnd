import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { useProfile } from "../hooks";

interface MeetingModalProps {
  meetingId: number;
  isOpen: boolean;
  onClose: () => void;
}

const GroupMeetingModal = ({
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
      className="videocallModal"
      contentClassName="shadow-lg border-0"
    >
      <ModalBody className="p-0">
        <div>
          <iframe
            id="meetingIframe"
            src={`https://meet.beeenson.com:8443?name=${userProfile.name}&roomName=${meetingId}`}
            width="100%"
            title="group meeting"
            allow="camera;microphone"
            style={{ overflow: "hidden" }}
          ></iframe>
        </div>
      </ModalBody>
      <ModalFooter>
        <button onClick={leaveMeeting}>leave room</button>
      </ModalFooter>
    </Modal>
  );
};

export default GroupMeetingModal;
