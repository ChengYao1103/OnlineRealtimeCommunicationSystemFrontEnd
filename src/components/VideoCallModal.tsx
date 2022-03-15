import React, { useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import { toast } from "react-toastify";

// interface
import { CallItem } from "../data/calls";

//images
import imagePlaceholder from "../assets/images/users/profile-placeholder.png";

interface VideoCallModalProps {
  user: CallItem | null;
  userName: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const VideoCallModal = ({
  isOpen,
  onClose,
  user,
  userName,
}: VideoCallModalProps) => {
  const [isLoadMedia, setIsLoadMedia] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [isCloseSpeaker, setIsCloseSpeaker] = useState(false);
  const [isCloseCamera, setIsCloseCamera] = useState(false);
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([]);
  //const [cameraType, setCameraType] = useState("front");
  const [currentStream, setCurrentStream] = useState(new MediaStream());

  const setMute = () => {
    setIsMute(!isMute);
    currentStream.getTracks().forEach(track => {
      if (track.kind === "audio" && track.readyState === "live") {
        track.enabled = isMute;
      }
    });
    console.log(currentStream.getTracks()); // enabled:true/false
  };

  const setSpeaker = () => {
    setIsCloseSpeaker(!isCloseSpeaker);
  };

  const setCamera = () => {
    setIsCloseCamera(!isCloseCamera);
    currentStream.getTracks().forEach(track => {
      if (track.kind === "video" && track.readyState === "live") {
        track.enabled = isCloseCamera;
      }
    });
    console.log(currentStream.getTracks()); // enabled:true/false
  };

  const changeCamera = () => {
    let mes = "";
    cameraList.forEach(element => {
      mes += "裝置名稱：" + element.label + "\n";
    });
    toast.success(mes);
  };

  if (isOpen && !isLoadMedia) {
    setIsLoadMedia(true);
    //取得相機列表
    let list: MediaDeviceInfo[] = [];
    navigator.mediaDevices
      .enumerateDevices()
      .then(devices => {
        devices.forEach(device => {
          if (device.kind === "videoinput") {
            list.push(device);
          }
        });
        setCameraList(list);
        //console.log(list);
      })
      .catch(err => {
        console.error(err);
      })
      //設定媒體輸入
      .finally(() => {
        navigator.mediaDevices
          .getUserMedia({
            audio: true,
            video: {
              frameRate: { ideal: 60, max: 120 },
              deviceId: { exact: list[0].deviceId || undefined },
            },
          })
          .then(function (stream) {
            setCurrentStream(stream);
          })
          .catch(function (err) {
            console.log(err);
          });
        console.log("Loaded!!");
      });
  }

  //防止回音
  const setVideo = (video: HTMLVideoElement) => {
    let stream = new MediaStream();
    //取得video track
    currentStream.getVideoTracks().forEach(track => {
      stream.addTrack(track);
    });
    //只輸出video track
    video.srcObject = stream;
  };

  const finishCall = () => {
    let stream = currentStream;
    stream.getTracks().forEach(track => {
      track.stop();
      track.enabled = false;
    });
    setCurrentStream(stream);
    console.log(currentStream.getTracks()); // readyState:"ended"(分頁的取用圖示消失)
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
        <img
          src={user && user.profileImage ? user.profileImage : imagePlaceholder}
          alt=""
          className="videocallModal-bg"
        />

        <div className="position-absolute start-0 end-0 bottom-0">
          <video
            autoPlay
            ref={video => {
              if (video && isLoadMedia) {
                setVideo(video);
              }
            }}
            id="testVideo"
            className="position-absolute ms-3"
            style={{ width: "25%", top: "-100px" }}
          ></video>
          <div className="text-center">
            <div className="d-flex justify-content-center align-items-center text-center">
              <div className="avatar-md h-auto">
                <Button
                  color={isMute ? "danger" : "light"}
                  onClick={() => setMute()}
                  type="button"
                  className="avatar-sm rounded-circle"
                >
                  {isMute ? (
                    <span className="avatar-title bg-transparent text-white font-size-20">
                      <i className="bx bx-microphone-off"></i>
                    </span>
                  ) : (
                    <span className="avatar-title bg-transparent text-muted font-size-20">
                      <i className="bx bx-microphone"></i>
                    </span>
                  )}
                </Button>
              </div>
              <div className="avatar-md h-auto">
                <Button
                  color={isCloseSpeaker ? "danger" : "light"}
                  onClick={() => setSpeaker()}
                  type="button"
                  className="avatar-sm rounded-circle"
                >
                  {isCloseSpeaker ? (
                    <span className="avatar-title bg-transparent text-white font-size-20">
                      <i className="bx bx-volume-mute"></i>
                    </span>
                  ) : (
                    <span className="avatar-title bg-transparent text-muted font-size-20">
                      <i className="bx bx-volume-full"></i>
                    </span>
                  )}
                </Button>
              </div>
              <div className="avatar-md h-auto">
                <Button
                  color={isCloseCamera ? "danger" : "light"}
                  onClick={() => setCamera()}
                  type="button"
                  className="avatar-sm rounded-circle"
                >
                  {isCloseCamera ? (
                    <span className="avatar-title bg-transparent text-white font-size-20">
                      <i className="bx bx-video-off"></i>
                    </span>
                  ) : (
                    <span className="avatar-title bg-transparent text-muted font-size-20">
                      <i className="bx bx-video"></i>
                    </span>
                  )}
                </Button>
              </div>
              <div className="avatar-md h-auto">
                <Button
                  color="light"
                  type="button"
                  onClick={() => changeCamera()}
                  className="avatar-sm rounded-circle"
                >
                  <span className="avatar-title bg-transparent text-muted font-size-20">
                    <i className="bx bx-refresh"></i>
                  </span>
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <Button
                color="danger"
                type="button"
                className="avatar-md call-close-btn rounded-circle"
                onClick={() => finishCall()}
              >
                <span className="avatar-title bg-transparent font-size-24">
                  <i className="mdi mdi-phone-hangup"></i>
                </span>
              </Button>
            </div>
          </div>

          <div className="p-4 bg-primary mt-n4">
            <div className="text-white mt-4 text-center">
              <h5 className="font-size-18 text-truncate mb-0 text-white">
                {userName}
              </h5>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default VideoCallModal;
