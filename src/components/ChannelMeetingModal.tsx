import { url } from "inspector";
import { useRef, useState } from "react";
import { useRedux } from "../hooks";
import Stack from 'react-bootstrap/Stack';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Input, InputGroup } from "reactstrap";
import { useProfile } from "../hooks";
import VideoPlayer from "./VideoPlayer";

// apis
import { APIClient } from "../api/apiCore";
import { WSEvent, WSSendEvents } from "../repository/wsEvent";
import { WSConnection } from "../api/webSocket";

interface MeetingModalProps {
  channelId: number;
  isOpen: boolean;
  onClose: () => void;
}


const ChannelMeetingModal = ({
  isOpen,
  channelId,
  onClose,
}: MeetingModalProps) => {
  const api = new APIClient();
  const { userProfile } = useProfile();
  const inputUrl = useRef<any>();
  const buttonUpdateVideo = useRef<any>();
  const syncVideoButton = useRef<any>();
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=b9IkpUYlOx8");
  const [syncVideoButtonText, setSyncVideoButtonText] = useState("開啟");
  
  const { useAppSelector } = useRedux();
  const { meetingId } = useAppSelector(state => ({
    meetingId: state.Calls.meetingId,
  }));

  const leaveMeeting = () => {
    var iframe = document.getElementById("meetingIframe") as HTMLIFrameElement;
    iframe.src = "";
    onClose();
  };

  const startVideoSync = () => {
    inputUrl.current.classList.remove("d-none");
    buttonUpdateVideo.current.classList.remove("d-none");
    // player display
    let player = document.getElementById("player") as HTMLDivElement;
    player.classList.remove("d-none");
  };

  const closeVideoSync = () => {
    inputUrl.current.classList.add("d-none");
    buttonUpdateVideo.current.classList.add("d-none");
    // player display
    let player = document.getElementById("player") as HTMLDivElement;
    player.classList.add("d-none");
  };

  const switchSyncAppStatus = () => {
    if(!inputUrl.current)
      return;
    if (syncVideoButtonText === "開啟") {
      setSyncVideoButtonText("關閉");
      startVideoSync();

      /*let send: WSEvent = {
        event: WSSendEvents.CreateApp,
        data: {
          appID: 1,
        },
      };
      api.WSSend(JSON.stringify(send));*/
    } else {
      setSyncVideoButtonText("開啟");
      closeVideoSync();

      /*let send: WSEvent = {
        event: WSSendEvents.FinishApp,
        data: {
          appID: 1,
        },
      };
      api.WSSend(JSON.stringify(send));*/
    }
  };

  const changeVideo = () => {
    if(!inputUrl.current)
      return;
    setUrl(inputUrl.current.value);
  };

  let send: WSEvent = {
    event: WSSendEvents.CreateMeeting,
    data: {
      channelID: {channelId},
    },
  };
  api.WSSend(JSON.stringify(send));
  

  return (
    <Modal
      size="lg"
      style={{maxWidth: "70%", maxHeight: "75%"}}
      modalClassName=""
      isOpen={isOpen}
      tabIndex={-1}
      centered
      className="channelMeetingModal"
      contentClassName="shadow-lg border-0"
    >
      <ModalHeader>
        會議
      </ModalHeader>
      <ModalBody className="d-flex align-items-stretch" style={{height: "70%"}}>
        <Stack gap={3}>
          <Stack direction="horizontal">
            <Button 
              type="button"
              className="btn btn-primary col-2"
              style={{marginRight: "30px"}}
              onClick={switchSyncAppStatus}
              innerRef={syncVideoButton}>
              {syncVideoButtonText}YouTube同步
            </Button>
            <Input
              type="text"
              name="videoUrlInput"
              id="channelMeetingModalVideoUrl-input"
              className="d-none"
              placeholder="輸入影片網址"
              innerRef={inputUrl}
            />
            <Button
              type="button"
              className="btn btn-primary col-1 d-none"
              onClick={changeVideo}
              innerRef={buttonUpdateVideo}>
              更新影片
            </Button>
          </Stack>

          <div style={{ width: "100%", height: "100%"}}>
            <iframe
              id="meetingIframe"
              src={`https://meet.beeenson.com:8443?name=${userProfile.name}&roomName=${channelId}`}
              width="100%"
              title="group meeting"
              allow="camera;microphone"
              scrolling="no"
              style={{ borderRadius: "5px", height: "100%" }}
            ></iframe>
            <VideoPlayer
              height="50%"
              width="50%"
              className="d-none"
              style={{marginTop: "-35%", marginLeft: "auto", marginRight: "0"}}
              url={url}
            />
          </div>
        </Stack>
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
