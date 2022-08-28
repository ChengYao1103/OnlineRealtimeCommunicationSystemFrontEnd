import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";

// interface
import { CallItem } from "../data/calls";
import { userModel } from "../redux/auth/types";

//images
import imagePlaceholder from "../assets/images/users/profile-placeholder.png";
import { APIClient } from "../api/apiCore";
import { WSEvent, WSSendEvents } from "../repository/wsEvent";
import { WSConnection } from "../api/webSocket";
import { useProfile } from "../hooks";
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
  const [isLoad, setIsLoad] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [isCloseSpeaker, setIsCloseSpeaker] = useState(false);
  const [currentStream, setCurrentStream] = useState(new MediaStream());
  const [connection, setConnection] = useState<RTCPeerConnection>();
  const { userProfile } = useProfile();
  const api = new APIClient();

  /** 設定socket和RTC參數
   * @param stream 從使用者端取得的音訊設備
   * @returns {RTCPeerConnection} 設定好的RTC物件
   */
  const setRTC = (stream: MediaStream) => {
    var newConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302", // Google's public STUN server
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
      var audioRef = document.getElementById("remoteAudio") as HTMLAudioElement;
      if (audioRef && !audioRef.srcObject && event.streams) {
        setRemoteAudio(audioRef, event.streams[0]);
        console.log("接收流並顯示於遠端視訊！", event);
      }
    };

    WSConnection.getSignalingEvent = async info => {
      if (info.desc && !newConnection.currentRemoteDescription) {
        console.log("desc => ", info.desc);
        await newConnection.setRemoteDescription(
          new RTCSessionDescription(info.desc)
        );
        var isOffer = info.desc.type === "answer";
        await createSignal(isOffer, newConnection);
      } else if (info.candidate) {
        console.log("candidate =>", info.candidate);
        newConnection.addIceCandidate(new RTCIceCandidate(info.candidate));
      }
    };

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
    setIsCloseSpeaker(!isCloseSpeaker);
  };

  // 初始化麥克風 & socket和RTC相關設定
  useEffect(() => {
    if (isOpen && !isLoad) {
      setIsLoad(true);
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
          if (stream) {
            var newConnection: RTCPeerConnection;
            newConnection = setRTC(stream);
            if (!isBeenCalled) {
              createSignal(true, newConnection);
              console.log("有來電!");
            }
            setCurrentStream(stream);
            setConnection(newConnection);
          }
          console.log("Loaded!!");
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }, [isOpen, isLoad]);

  /** 結束通話 */
  const finishCall = () => {
    WSConnection.getSignalingEvent = undefined;
    currentStream.getTracks().forEach(track => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
    console.log(currentStream.getTracks()); // readyState:"ended"(分頁的取用圖示消失)
    // 關閉ws
    // var data: WSEvent = {
    //   event: WSSendEvents.EndPhoneCall,
    //   data: {
    //     from: userProfile.id,
    //   },
    // };
    // api.WSSend(JSON.stringify(data));
    onClose();
  };

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
              <h5 className="font-size-11 text-uppercase text-muted mt-2">
                Mute
              </h5>
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
              <h5 className="font-size-11 text-uppercase text-muted mt-2">
                Speaker
              </h5>
            </div>
            <div className="avatar-md h-auto">
              <Button
                color="light"
                type="button"
                className="avatar-sm rounded-circle"
              >
                <span className="avatar-title bg-transparent text-muted font-size-20">
                  <i className="bx bx-user-plus"></i>
                </span>
              </Button>
              <h5 className="font-size-11 text-uppercase text-muted mt-2">
                Add New
              </h5>
            </div>
          </div>

          <div className="mt-4">
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
