import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import { toast } from "react-toastify";
import { useRedux } from "../hooks";

// interface
import { CallItem } from "../data/calls";
import { userModel } from "../redux/auth/types";

//images
import imagePlaceholder from "../assets/images/users/profile-placeholder.png";

// apis
import { APIClient } from "../api/apiCore";
import { WSEvent, WSSendEvents } from "../repository/wsEvent";
import { WSConnection } from "../api/webSocket";
import { resetCallingStatus } from "../redux/actions";

interface VideoCallModalProps {
  isBeenCalled: boolean;
  callInfo: CallItem | null;
  user: userModel; //對方
  isOpen: boolean;
  onClose: () => void;
}

const VideoCallModal = ({
  isBeenCalled,
  isOpen,
  onClose,
  callInfo,
  user,
}: VideoCallModalProps) => {
  const { dispatch, useAppSelector } = useRedux();
  const { endCalling } = useAppSelector(state => ({
    endCalling: state.Calls.endCalling,
  }));

  const [isLoad, setIsLoad] = useState(false);
  const [isAccept, setIsAccept] = useState(!isBeenCalled);
  const [isMute, setIsMute] = useState(false);
  const [isCloseSpeaker, setIsCloseSpeaker] = useState(false);
  const [isCloseCamera, setIsCloseCamera] = useState(false);
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([]);
  //const [cameraType, setCameraType] = useState("front");
  const [currentStream, setCurrentStream] = useState(new MediaStream());
  const [connection, setConnection] = useState<RTCPeerConnection>();
  const api = new APIClient();

  /** 設定socket和RTC參數
   * @param stream 從使用者端取得的音訊設備
   * @returns {RTCPeerConnection} 設定好的RTC物件
   */
  const setRTC = (stream: MediaStream) => {
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

      let send: WSEvent = {
        event: WSSendEvents.SendSignalingInformation,
        data: {
          to: user.id,
          info: {
            candidate: candidate,
          },
        },
      };
      api.WSSend(JSON.stringify(send));
    };

    newConnection.oniceconnectionstatechange = evt => {
      console.log(
        "ICE 伺服器狀態變更 => \n",
        (evt.target as RTCPeerConnection).iceConnectionState
      );
    };

    newConnection.ontrack = event => {
      var videoRef = document.getElementById("remoteVideo") as HTMLVideoElement;
      if (videoRef && !videoRef.srcObject && event.streams) {
        setRemoteVideo(videoRef, event.streams[0]);
        console.log("接收流並顯示於遠端視訊！", event);
      }
    };

    WSConnection.getSignalingEvent = async data => {
      console.log(data);
      if (data.info.desc && !newConnection.currentRemoteDescription) {
        console.log("desc => ", data.info.desc);
        await newConnection.setRemoteDescription(
          new RTCSessionDescription(data.info.desc)
        );
        var isOffer = data.info.desc.type === "answer";
        await createSignal(isOffer, newConnection);
      } else if (data.info.candidate) {
        console.log("candidate =>", data.info.candidate);
        newConnection.addIceCandidate(new RTCIceCandidate(data.info.candidate));
      }
    };

    while (WSConnection.signalingInfoQueue.length !== 0) {
      var info = WSConnection.signalingInfoQueue.shift();
      WSConnection.getSignalingEvent(info);
    }

    return newConnection;
  };

  /** 建立signal
   * @param isOffer 是接收端還是發起端
   * @param newConnection RTCPeerConnection設定
   */
  const createSignal = async (
    isOffer: boolean,
    newConnection: RTCPeerConnection
  ) => {
    try {
      var offer = await newConnection[`create${isOffer ? "Offer" : "Answer"}`]({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await newConnection.setLocalDescription(offer);
      console.log(newConnection.localDescription);
      console.log(`寄出 ${isOffer ? "offer" : "answer"}`);

      let send: WSEvent = {
        event: WSSendEvents.SendSignalingInformation,
        data: {
          to: user.id,
          info: {
            desc: newConnection.localDescription,
          },
        },
      };
      api.WSSend(JSON.stringify(send));
    } catch (err) {
      console.log(err);
    }
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
    if (isOpen && !isLoad && isAccept) {
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
              if (stream) {
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
                var newConnection: RTCPeerConnection;
                newConnection = setRTC(stream);
                if (!isBeenCalled) {
                  createSignal(true, newConnection);
                }
                setCurrentStream(stream);
                setConnection(newConnection);
              }
              console.log("Loaded!!");
            })
            .catch(function (err) {
              console.log(err);
            });
        });
      console.log("Loaded!!");
    }
  }, [isOpen, isLoad, isAccept]);

  // 被掛電話時執行
  useEffect(() => {
    if (endCalling) {
      finishCall();
    }
  }, [endCalling]);

  const finishCall = () => {
    WSConnection.getSignalingEvent = undefined;
    WSConnection.signalingInfoQueue = [];
    let stream = currentStream;
    stream.getTracks().forEach(track => {
      track.stop();
      track.enabled = false;
    });
    setCurrentStream(stream);
    console.log(currentStream.getTracks()); // readyState:"ended"(分頁的取用圖示消失)
    // 透過ws發送掛斷的請求
    if (!endCalling) {
      var data: WSEvent = {
        event: WSSendEvents.EndPhoneCall,
        data: {
          to: user.id,
          info: {
            desc: connection?.localDescription,
          },
        },
      };
      api.WSSend(JSON.stringify(data));
    }
    dispatch(resetCallingStatus());
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
          {!isAccept && (
            <img
              src={user.photo ? user.photo : imagePlaceholder}
              alt=""
              className="videocallModal-bg"
            />
          )}
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
            {isAccept && (
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
            )}

            <div className="mt-4">
              {isBeenCalled && !isAccept && (
                <Button
                  type="button"
                  className="me-5 btn btn-success avatar-md call-close-btn rounded-circle"
                  color="success"
                  onClick={() => setIsAccept(true)}
                >
                  <span className="avatar-title bg-transparent font-size-24">
                    <i className="mdi mdi-phone"></i>
                  </span>
                </Button>
              )}
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
