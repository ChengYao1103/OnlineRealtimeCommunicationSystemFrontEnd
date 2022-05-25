import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { WSConnection } from "../api/webSocket";
import { useProfile } from "../hooks";
import { chatWebsocketEvent } from "../redux/actions";
import { ChatsActionTypes } from "../redux/chats/types";
import { NewContent, WSEvent, WSReceiveEvents } from "../repository/wsEvent";


const WSEventHandler = () => {  
  const dispatch = useDispatch();
  const { userProfile } = useProfile();

  WSConnection.onMessageEvent = (event: any) => {
    let data: WSEvent = JSON.parse(event.data);
    console.log(data.event);
    switch(data.event) {
      case WSReceiveEvents.NewContent:
        let contentInfo = data.data as NewContent;
        if(contentInfo.type === 0 && contentInfo.from !== userProfile.id) {
          toast.info(contentInfo.from + ":" + contentInfo.content);
        }
        dispatch(chatWebsocketEvent(ChatsActionTypes.RECEIVE_MESSAGE, {
          SenderID: contentInfo.from,
          ReceiverID: contentInfo.to,
          Content: contentInfo.content,
          Time: contentInfo.time,
          Type: contentInfo.type,
        }));
        break;
      case WSReceiveEvents.ContentBeenRead:
        break;
      case WSReceiveEvents.TokenExpired:
        console.log("token expired");
        break;
      default:
        console.log("unknown ws event");
        break;
    }
  }
    
  return(
    <></>
  );
};

export default WSEventHandler;