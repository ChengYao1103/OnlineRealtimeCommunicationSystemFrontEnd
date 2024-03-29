import { url } from "inspector";
import { useEffect, useRef, useState } from "react";
import { useRedux } from "../hooks";
import Stack from "react-bootstrap/Stack";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  InputGroup,
} from "reactstrap";
import { useProfile } from "../hooks";

// apis
import { APIClient } from "../api/apiCore";
import { WSEvent, WSSendEvents } from "../repository/wsEvent";
import { WSConnection } from "../api/webSocket";
import { WSApp, YoutubeSync, YTEvent } from "../repository/wsAppEvent";
import ReactPlayer from "react-player";
import React from "react";
import { RefObject } from "react";
import { toast } from "react-toastify";
import { changeMeetingId } from "../redux/actions";

interface MeetingModalProps {
  channelId: number;
  isOpen: boolean;
  isCreate: boolean;
  onClose: () => void;
}

const ChannelMeetingModal = ({
  isOpen,
  channelId,
  isCreate,
  onClose,
}: MeetingModalProps) => {
  const api = new APIClient();
  const { dispatch } = useRedux();
  const { userProfile } = useProfile();
  const inputUrl = useRef<any>();
  const player = useRef() as RefObject<ReactPlayer>;
  const buttonUpdateVideo = useRef<any>();
  const syncVideoButton = useRef<any>();
  const [syncVideoButtonText, setSyncVideoButtonText] = useState("開啟");
  const [url, setUrl] = useState("");
  const [playing, setPlaying] = useState(false);
  const [YTPlayerHost, setYTPlayerHost] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [skipUpdate, setSkipUpdateChange] = useState(false);
  const [expectTime, setExpectTime] = useState(0);

  const { useAppSelector } = useRedux();
  const { meetingId, startedYT, syncYT, openedApps, userJoinRoom } = useAppSelector(state => ({
    meetingId: state.Calls.meetingId,
    startedYT: state.Calls.startedYT,
    syncYT: state.Calls.syncYT,
    openedApps: state.Calls.openedApps,
    userJoinRoom: state.Calls.userJoinRoom,
  }));

  // create meeting (get ws receive)
  useEffect(() => {
    if (!isCreate) return;
    let send: WSEvent = {
      event: WSSendEvents.CreateMeeting,
      data: {
        channelId: channelId,
      },
    };
    api.WSSend(JSON.stringify(send));
  }, [channelId]);

  // join meeting
  useEffect(() => {
    if (isCreate || meetingId === 0) return;
    let send: WSEvent = {
      event: WSSendEvents.JoinMeeting,
      data: {
        meetingId: meetingId,
      },
    };
    api.WSSend(JSON.stringify(send));
  }, [channelId, meetingId]);

  useEffect(() => {
    if (YTPlayerHost) {
      update({});
    }
  }, [userJoinRoom]);

  useEffect(() => {
    console.log("YTPlayerHost", YTPlayerHost);
  }, [YTPlayerHost]);

  useEffect(() => {
    (openedApps as WSApp[]).forEach(appID => {
      switch(appID) {
        case WSApp.YouTubeSync:
          showVideoSyncUI();
          break;
      }
    });
  }, [openedApps]);

  const leaveMeeting = () => {
    var iframe = document.getElementById("meetingIframe") as HTMLIFrameElement;
    iframe.src = "";
    let send: WSEvent = {
      event: WSSendEvents.LeaveMeeting,
      data: {},
    };
    api.WSSend(JSON.stringify(send));
    dispatch(changeMeetingId(0));
    onClose();
  };

  // control UI display or not (youtube sync)
  const showVideoSyncUI = () => {
    if (!inputUrl.current) return;
    setSyncVideoButtonText("關閉");
    inputUrl.current.classList.remove("d-none");
    buttonUpdateVideo.current.classList.remove("d-none");
    // player display
    let player = document.getElementById("player") as HTMLDivElement;
    player.classList.remove("d-none");
  };

  const hideVideoSyncUI = () => {
    if (!inputUrl.current) return;
    setSyncVideoButtonText("開啟");
    inputUrl.current.classList.add("d-none");
    buttonUpdateVideo.current.classList.add("d-none");
    // player display
    let player = document.getElementById("player") as HTMLDivElement;
    player.classList.add("d-none");
  };

  const switchSyncAppStatus = () => {
    if (!inputUrl.current) return;
    if (syncVideoButtonText === "開啟") {
      showVideoSyncUI();

      let send: WSEvent = {
        event: WSSendEvents.CreateApp,
        data: {
          appID: WSApp.YouTubeSync,
        },
      };
      api.WSSend(JSON.stringify(send));
      setYTPlayerHost(true);
    } else {
      hideVideoSyncUI();

      let send: WSEvent = {
        event: WSSendEvents.FinishApp,
        data: {
          appID: WSApp.YouTubeSync,
        },
      };
      api.WSSend(JSON.stringify(send));
    }
  };

  /* update youtube sync events */
  const update = (obj: YoutubeSync, autoFillTime = true) => {
    if (!player.current) return;
    if(autoFillTime) {
      obj.currentTime = Math.round(player.current.getCurrentTime());
    }

    let send: WSEvent = {
      event: WSSendEvents.UpdateApp,
      data: {
        appID: WSApp.YouTubeSync,
        event: {
          event: YTEvent.sync,
          data: obj,
        },
      },
    };
    api.WSSend(JSON.stringify(send));
    setYTPlayerHost(true);
  };

  const changeVideo = () => {
    if (!inputUrl.current) return;

    let url = inputUrl.current.value;
    if (!ReactPlayer.canPlay(url)) {
      toast.error("網址錯誤，請檢查！！");
      return;
    }

    setUrl(url);
    let info: YoutubeSync = {
      video: url,
    };
    update(info, false);
  };

  const onPlay = () => {
    if (!player.current) return;

    if (skipUpdate) {
      // trigger by WS event
      setSkipUpdateChange(false);
      return;
    }

    setPlaying(true);
    let info: YoutubeSync = {
      playing: true,
    };
    update(info);
  };

  const onPause = () => {
    if (!player.current) return;

    if (skipUpdate) {
      // trigger by WS event
      setSkipUpdateChange(false);
      return;
    }

    setPlaying(false);
    let info: YoutubeSync = {
      playing: false,
    };
    update(info);
  };

  const onReady = () => {
    if (!player.current) return;

    let playerTime = player.current.getCurrentTime();
    
    if (Math.abs(playerTime - syncYT.currentTime) > 1) {
      setSkipUpdateChange(true);
      player.current.seekTo(syncYT.currentTime);
    }
  }

  const onPlaybackRateChange = (speed: string) => {
    if (!player.current) return;

    if (skipUpdate) {
      // trigger by WS event
      setSkipUpdateChange(false);
      return;
    }

    setPlaybackRate(parseFloat(speed));
    let info: YoutubeSync = {
      rate: speed.toString(),
    };
    update(info);
  };

  /* receive youtube sync events */
  useEffect(() => {
    if (startedYT) {
      showVideoSyncUI();
    } else {
      hideVideoSyncUI();
    }
  }, [startedYT]);

  useEffect(() => {
    if (!player.current) return;
    setYTPlayerHost(false);
    // video
    if (url !== syncYT.video) {
      setSkipUpdateChange(true);
      setUrl(syncYT.video);
    }
    // time
    let playerTime = player.current.getCurrentTime();
    setExpectTime(syncYT.currentTime);
    if (Math.abs(playerTime - expectTime) > 1) {
      setSkipUpdateChange(true);
      player.current.seekTo(syncYT.currentTime);
    }
    // state
    if (playing !== syncYT.playing) {
      setSkipUpdateChange(true);
      setPlaying(syncYT.playing);
    }
    // rate
    let rate = parseFloat(syncYT.rate);
    if (playbackRate !== rate) {
      setSkipUpdateChange(true);
      setPlaybackRate(rate);
    }
  }, [syncYT]);

  return (
    <Modal
      size="lg"
      style={{ maxWidth: "70%", maxHeight: "75%" }}
      modalClassName=""
      isOpen={isOpen}
      tabIndex={-1}
      centered
      className="channelMeetingModal"
      contentClassName="shadow-lg border-0"
    >
      <ModalHeader>會議</ModalHeader>
      <ModalBody
        className="d-flex align-items-stretch"
        style={{ height: "70%" }}
      >
        <Stack gap={3}>
          <Stack direction="horizontal">
            <Button
              type="button"
              className="btn btn-primary col-2"
              style={{ marginRight: "30px" }}
              onClick={switchSyncAppStatus}
              innerRef={syncVideoButton}
            >
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
              innerRef={buttonUpdateVideo}
            >
              更新影片
            </Button>
          </Stack>

          <div style={{ width: "100%", height: "100%", flexGrow: 1 }}>
            {
              <iframe
                id="meetingIframe"
                src={`https://meet.beeenson.com:8443?name=${userProfile.name}&roomName=${meetingId}`}
                width="100%"
                title="group meeting"
                allow="camera;microphone"
                scrolling="no"
                style={{ borderRadius: "5px", height: "100%" }}
              ></iframe>
            }
            <ReactPlayer
              className="react-player d-none"
              url={url}
              width="50%"
              height="50%"
              style={{
                position: "relative",
                bottom: "7px",
                marginLeft: "auto",
                marginRight: "1px",
                transform: "translateY(-100%)",
              }}
              controls={true}
              id={"player"}
              ref={player}
              playing={playing}
              playbackRate={playbackRate}
              onPlay={onPlay}
              onPause={onPause}
              onReady={onReady}
              onSeek={e => console.log("onSeek", e)}
              onPlaybackRateChange={onPlaybackRateChange}
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
