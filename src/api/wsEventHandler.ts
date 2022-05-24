import { NewContent, WSEvent, WSReceiveEvents } from "../repository/wsEvent";

export function WSEventHandler(data: WSEvent, selfid: number) {
  switch(data.event) {
    case WSReceiveEvents.NewContent:
      NewContentHandler(data.data as NewContent, selfid);
      break;
    case WSReceiveEvents.BeenReadContent:
      break;
    case WSReceiveEvents.TokenExpired:
      TokenExpiredHandler();
      break;
  }
}

function NewContentHandler(content: NewContent, selfid: number) {
  if (content.from === selfid) {
    // self send message
    
  } else {
    // other user's message
  }
  console.log(content.from);
}

function TokenExpiredHandler() {
  window.location.href = './logout';
}