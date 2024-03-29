import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import { useRedux } from "../hooks";
import { resetCallingStatus } from "../redux/actions";

// interface
import { CallItem } from "../data/calls";
import { userModel } from "../redux/auth/types";

//images
import imagePlaceholder from "../assets/images/users/profile-placeholder.png";
import callGif from "../assets/images/incomingCall.gif";

// apis
import { APIClient } from "../api/apiCore";
import { WSEvent, WSSendEvents } from "../repository/wsEvent";
import { WSConnection } from "../api/webSocket";
import { toast } from "react-toastify";
import { showErrorNotification } from "../helpers/notifications";

interface AudioCallModalProps {
  isBeenCalled: boolean;
  callInfo: CallItem | null;
  user: userModel; //對方
  isOpen: boolean;
  onClose: () => void;
}

const AudioCallModal = ({
  isOpen,
  onClose,
  callInfo,
  user,
  isBeenCalled,
}: AudioCallModalProps) => {
  const { dispatch, useAppSelector } = useRedux();
  const { endCalling, hasAnsweredCalling } = useAppSelector(state => ({
    endCalling: state.Calls.endCalling,
    hasAnsweredCalling: state.Calls.hasAnswered,
  }));

  const [isLoad, setIsLoad] = useState(false);
  const [isAccept, setIsAccept] = useState(!isBeenCalled);
  const [isMute, setIsMute] = useState(false);
  const [isCloseSpeaker, setIsCloseSpeaker] = useState(false);
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
          type: "audio",
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
      var audioRef = document.getElementById("remoteAudio") as HTMLAudioElement;
      if (audioRef && !audioRef.srcObject && event.streams) {
        setRemoteAudio(audioRef, event.streams[0]);
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
        offerToReceiveVideo: false,
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
          type: "audio",
        },
      };
      api.WSSend(JSON.stringify(send));
    } catch (err) {
      console.log(err);
    }
  };

  const setRemoteAudio = (
    audioElement: HTMLAudioElement,
    stream: MediaStream
  ) => {
    console.log(stream);
    audioElement.srcObject = stream;
  };

  /** 設定麥克風禁音 */
  const setMute = () => {
    setIsMute(!isMute);
    currentStream.getTracks().forEach(track => {
      if (track.kind === "audio" && track.readyState === "live") {
        track.enabled = isMute;
      }
    });
    console.log(currentStream.getTracks()); // enabled:true/false
  };

  /** 設定喇叭禁音 */
  const setSpeaker = () => {
    var audioEle = document.getElementById("remoteAudio") as HTMLAudioElement;
    if (!audioEle.srcObject) {
      return;
    }
    // Ex: 關閉喇叭狀態下進來 => isCloseSpeaker = true
    // enable = true => 不會禁音
    // 調整完再更改isCloseSpeaker狀態
    let stream = audioEle.srcObject as MediaStream;
    stream.getAudioTracks().forEach(track => {
      track.enabled = isCloseSpeaker;
    });
    setIsCloseSpeaker(!isCloseSpeaker);
  };

  // 初始化麥克風 & socket和RTC相關設定
  useEffect(() => {
    if (isOpen && !isLoad && isAccept) {
      setIsLoad(true);
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
          if (stream) {
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
          showErrorNotification("請確認麥克風的權限是否開啟");
          onClose();
        });
    }
    console.log(isOpen);
  }, [isOpen, isLoad, isAccept]);

  // 被掛電話時執行
  useEffect(() => {
    if (endCalling) {
      finishCall();
    }
  }, [endCalling]);

  /** 結束通話 */
  const finishCall = () => {
    WSConnection.getSignalingEvent = undefined;
    WSConnection.signalingInfoQueue = [];
    currentStream.getTracks().forEach(track => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
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

  /**
   * 回應來電
   * @param isAcceptPhoneCall 是否接聽
   */
  const answerPhoneCall = (isAcceptPhoneCall: boolean) => {
    if (isAcceptPhoneCall) {
      setIsAccept(true);
    } else {
      finishCall();
    }
    var data: WSEvent = {
      event: WSSendEvents.ResponsePhoneCall,
      data: {
        accept: isAcceptPhoneCall,
      },
    };
    api.WSSend(JSON.stringify(data));
  };

  /** 多處登入時，其中一處對來電做出回應，其他處就關閉modal */
  useEffect(() => {
    if (!isAccept && hasAnsweredCalling) {
      onClose();
    }
  }, [isAccept, hasAnsweredCalling, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      tabIndex={-1}
      centered
      className="audiocallModal"
      contentClassName="shadow-lg border-0"
    >
      <ModalBody className="p-0">
        <div className="text-center p-4 pb-0">
          <div className="avatar-xl mx-auto mb-4">
            <img
              src={user.photo ? user.photo : imagePlaceholder}
              alt=""
              className="img-thumbnail rounded-circle"
            />
          </div>

          {isAccept && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <div className="avatar-md h-auto">
                <audio id="remoteAudio" autoPlay></audio>
                <Button
                  type="button"
                  color={isMute ? "danger" : "light"}
                  onClick={() => setMute()}
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
                  type="button"
                  color={isCloseSpeaker ? "danger" : "light"}
                  onClick={() => setSpeaker()}
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
            </div>
          )}

          <div className="mt-4 justify-content-center">
            {isBeenCalled && !isAccept ? (
              <>
                <Button
                  type="button"
                  className="me-5 btn btn-success avatar-md call-close-btn rounded-circle"
                  color="success"
                  onClick={() => answerPhoneCall(true)}
                >
                  <img
                    src={callGif}
                    alt=""
                    width="100%"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </Button>
                <Button
                  type="button"
                  className="btn btn-danger avatar-md call-close-btn rounded-circle"
                  color="danger"
                  onClick={() => answerPhoneCall(false)}
                >
                  <span className="avatar-title bg-transparent font-size-24">
                    <i className="mdi mdi-phone-hangup"></i>
                  </span>
                </Button>
              </>
            ) : (
              <Button
                type="button"
                className="btn btn-danger avatar-md call-close-btn rounded-circle"
                color="danger"
                onClick={() => finishCall()}
              >
                <span className="avatar-title bg-transparent font-size-24">
                  <i className="mdi mdi-phone-hangup"></i>
                </span>
              </Button>
            )}
          </div>
        </div>

        <div className="p-4 bg-soft-primary mt-n4">
          <div className="mt-4 text-center">
            <h5 className="font-size-18 mb-0 text-truncate">{user.name}</h5>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AudioCallModal;
