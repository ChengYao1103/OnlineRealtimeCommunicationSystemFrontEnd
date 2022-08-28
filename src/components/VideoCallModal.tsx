import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import { toast } from "react-toastify";
import openSocket, { Socket } from "socket.io-client";

// interface
import { CallItem } from "../data/calls";

//images
import imagePlaceholder from "../assets/images/users/profile-placeholder.png";
import { userModel } from "../redux/auth/types";

interface VideoCallModalProps {
  callInfo: CallItem | null;
  user: userModel; //對方
  isOpen: boolean;
  onClose: () => void;
}

const VideoCallModal = ({
  isOpen,
  onClose,
  callInfo,
  user,
}: VideoCallModalProps) => {
  const [isLoad, setIsLoad] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [isCloseSpeaker, setIsCloseSpeaker] = useState(false);
  const [isCloseCamera, setIsCloseCamera] = useState(false);
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([]);
  //const [cameraType, setCameraType] = useState("front");
  const [connection, setConnection] = useState<RTCPeerConnection>();
  const [socket, setSocket] = useState<Socket>();
  const [currentStream, setCurrentStream] = useState(new MediaStream());

  /** 設定socket和RTC參數
   * @param stream 從使用者端取得的音訊設備
   * @returns {Socket} 設定好的socket
   * @returns {RTCPeerConnection} 設定好的RTC物件
   *  */
  const setRTC = (stream: MediaStream) => {
    var newSocket = openSocket("wss://orcs-dev-signaling.beeenson.com", {
      transports: ["websocket"],
    });
    var newConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.beeenson.com:19302", // GCP's STUN server
        },
        {
          urls: "turn:turn.beeenson.com:19302", // GCP's TURN server
          username: "louis",
          credential: "12345",
        },
      ],
    });
    stream.getTracks().forEach(track => {
      newConnection.addTrack(track, stream);
    });
    newConnection.onicecandidate = ({ candidate }) => {
      if (!candidate) {
        return;
      }
      console.log("onIceCandidate => ", candidate);
      newSocket.emit("peerconnectSignaling", {
        candidate,
        to: "jedy-0",
        from: "hiro-1",
        room: "0509",
      });
    };
    newConnection.oniceconnectionstatechange = evt => {
      console.log(
        "ICE 伺服器狀態變更 => \n",
        (evt.target as RTCPeerConnection).iceConnectionState
      );
    };
    newConnection.ontrack = event => {
      var videoElement = document.getElementById(
        "remoteVideo"
      ) as HTMLVideoElement;
      if (videoElement && !videoElement.srcObject && event.streams) {
        setRemoteVideo(videoElement, event.streams[0]);
        console.log("接收流並顯示於遠端視訊！", event);
      }
    };
    newSocket.on("peerconnectSignaling", async ({ desc, from, candidate }) => {
      if (desc && !newConnection.currentRemoteDescription) {
        console.log("desc => ", desc);
        await newConnection.setRemoteDescription(
          new RTCSessionDescription(desc)
        );
        var isOffer = desc.type === "answer";
        try {
          if (!stream) {
            console.log("尚未開啟視訊");
            return;
          }
          var offer = await newConnection[
            `create${isOffer ? "Offer" : "Answer"}`
          ]({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          await newConnection.setLocalDescription(offer);
          console.log(newConnection.localDescription);
          console.log(`寄出 ${isOffer ? "offer" : "answer"}`);
          newSocket.emit("peerconnectSignaling", {
            desc: newConnection.localDescription,
            to: "jedy-0",
            from: "hiro-1",
            room: "0509",
          });
        } catch (err) {
          console.log(err);
        }
      } else if (candidate) {
        console.log("candidate =>", candidate);
        newConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
    newSocket.on("message", message => {
      console.log("房間接收 => ", message);
    });
    newSocket.on("roomBroadcast", message => {
      console.log("房間廣播 => ", message);
    });
    newSocket.on("connect", function () {
      console.log("Connected");
      newSocket.emit("joinRoom", "123");
    });
    newSocket.on("connect_error", function () {
      console.log("Connection failed");
    });
    newSocket.on("reconnect_failed", function () {
      console.log("Reconnection failed");
    });
    // 回傳複數參數
    return [newSocket, newConnection] as const;
  };

  const setRemoteVideo = (
    videoElement: HTMLVideoElement,
    stream: MediaStream
  ) => {
    videoElement.srcObject = stream;
  };

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

  // 初始化麥克風和相機 & socket和RTC相關設定
  useEffect(() => {
    if (isOpen && !isLoad) {
      setIsLoad(true);
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
              // 設定通話介面顯示自己的影像，不輸出聲音避免回音
              var videoSrc = new MediaStream();
              var videoElement = document.getElementById(
                "myVideo"
              ) as HTMLVideoElement;
              stream.getVideoTracks().forEach(track => {
                videoSrc.addTrack(track);
              });
              videoElement.srcObject = videoSrc;
              // 設定RTC與websocket
              var newSocket: Socket, newConnection: RTCPeerConnection;
              [newSocket, newConnection] = setRTC(stream);
              setCurrentStream(stream);
              setConnection(newConnection);
              setSocket(newSocket);
            })
            .catch(function (err) {
              console.log(err);
            });
        });
      console.log("Loaded!!");
    }
  }, [isOpen, isLoad]);

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
        <div className="videocallModal-bg">
          {/*<img
            src={user.photo ? user.photo : imagePlaceholder}
            alt=""
            className="videocallModal-bg"
          */}
          <video
            autoPlay
            id="remoteVideo"
            className="videocallModal-bg"
          ></video>
          <video
            autoPlay
            id="myVideo"
            className="position-absolute w-25 start-0 rounded-3"
            style={{ margin: "20px" }}
          ></video>
        </div>

        <div className="position-absolute start-0 end-0 bottom-0">
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
                {user.name}
              </h5>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default VideoCallModal;
