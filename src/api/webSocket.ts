import { WSEvent, WSReceiveEvents } from "../repository/wsEvent";
import { LOGOUT_URL } from "./apiCore";

export class WSConnection {
  public static instance: WebSocket;
  public static signalingInfoQueue: any[] = [];
  token: string;
  url: string;
  flag: boolean = false;
  heartbeat: any;
  public static onOpenEvent?: (event: any) => void;
  public static onMessageEvent?: (event: any) => void;
  public static onErrorEvent?: (event: any) => void;
  public static onCloseEvent?: (event: any) => void;
  public static getSignalingEvent?: (data: any) => void;

  constructor(url: string, token: string) {
    this.token = token;
    this.url = url;
    this.onConstruct();
  }

  onConstruct = () => {
    WSConnection.instance = new WebSocket(this.url, "http");
    WSConnection.instance.onopen = this.onOpen;
    WSConnection.instance.onmessage = this.onMessage;
    WSConnection.instance.onerror = this.onError;
    WSConnection.instance.onclose = this.onClose;
  };

  send = (data: string) => {
    WSConnection.instance.send(data);
  };

  //indicates that the connection is ready to send and receive data
  onOpen = (event: any) => {
    console.log("websocket is connected!");
    WSConnection.instance.send(this.token);

    this.heartbeat = setInterval(() => {
      WSConnection.instance.send("ping");
      this.flag = false;
      this.waitResponse();
    }, 55000);

    if (WSConnection.onOpenEvent) WSConnection.onOpenEvent(event);
  };

  waitResponse = () => {
    setTimeout(() => {
      if (!this.flag) {
        console.log(
          "Does not reveive pong after ping! Connection is going to close."
        );
        WSConnection.instance.close();
      }
    }, 5000);
  };

  //An event listener to be called when a message is received from the server
  onMessage = (event: any) => {
    if (event.data === "pong") {
      this.flag = true;
      return;
    }

    let data: WSEvent = JSON.parse(event.data);
    if (event.data === "time out" || data.event === WSReceiveEvents.TokenExpired) {
      WSConnection.instance.onclose = null;
      window.location.href = LOGOUT_URL;
    }

    if (WSConnection.onMessageEvent) WSConnection.onMessageEvent(event);
  };

  //An event listener to be called when an error occurs. This is a simple event named "error".
  onError = (event: any) => {
    console.log(JSON.stringify(event.data));
    if (WSConnection.onErrorEvent) WSConnection.onErrorEvent(event);
  };

  //An event listener to be called when the WebSocket connection's readyState changes to CLOSED.
  onClose = (event: any) => {
    clearInterval(this.heartbeat);
    console.log("websocket connection had closed!");
    if (WSConnection.onCloseEvent) {
      WSConnection.onCloseEvent(event);
    }
    this.onConstruct();
  };
}
