import React, { useState, useContext, useEffect, useRef } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import openSocket, { Socket } from "socket.io-client";

// interface
import { CallItem } from "../data/calls";
import { userModel } from "../redux/auth/types";

//images
import imagePlaceholder from "../assets/images/users/profile-placeholder.png";
interface AudioCallModalProps {
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
}: AudioCallModalProps) => {
  const [isLoad, setIsLoad] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [isCloseSpeaker, setIsCloseSpeaker] = useState(false);
  const [currentStream, setCurrentStream] = useState(new MediaStream());
  const [connection, setConnection] = useState<RTCPeerConnection>();
  const [socket, setSocket] = useState<Socket>();
  const [audioRef, setAudioRef] = useState<HTMLAudioElement>();
  const setAudio = (
    audio: HTMLAudioElement,
    stream: readonly MediaStream[]
  ) => {
    //audio.srcObject = stream;
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

  if (isOpen && !isLoad) {
    setIsLoad(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        if (stream) {
          setCurrentStream(stream);
        }
      })
      .catch(function (err) {
        console.log(err);
      });

    // 設定connection
    // wss://orcs-dev-signaling.beeenson.com
    var newSocket = openSocket("ws://127.0.0.1:8080", {
      transports: ["websocket"],
    });
    var newConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302", // Google's public STUN server
        },
      ],
    });
    currentStream.getTracks().forEach(track => {
      newConnection.addTrack(track, currentStream);
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
    newConnection.ontrack = event => {
      if (audioRef && !audioRef.srcObject && event.streams) {
        // setAudio(audioRef, event.streams);
        console.log(event.streams);
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
          if (!currentStream) {
            console.log("尚未開啟視訊");
            return;
          }
          var offer = await newConnection[
            `create${isOffer ? "Offer" : "Answer"}`
          ]({
            offerToReceiveAudio: true,
            offerToReceiveVideo: false,
          });
          await newConnection.setLocalDescription(offer);
          console.log(`寄出 ${isOffer ? "offer" : "answer"}`);
          newSocket.emit("peerconnectSignaling", {
            desc: desc,
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
      newSocket.emit("joinRoom", 123);
    });
    newSocket.on("connect_error", function () {
      console.log("Connection failed");
    });
    newSocket.on("reconnect_failed", function () {
      console.log("Reconnection failed");
    });
    setConnection(newConnection);
    setSocket(newSocket);
    console.log("Loaded!!");
  }

  const finishCall = () => {
    currentStream.getTracks().forEach(track => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
    socket?.close();
    console.log(currentStream.getTracks(), socket); // readyState:"ended"(分頁的取用圖示消失)
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
              <audio
                id="remote_audio"
                ref={audio => (audio ? setAudioRef(audio) : null)}
              ></audio>
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
