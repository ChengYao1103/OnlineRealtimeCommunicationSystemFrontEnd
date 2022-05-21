export class WSConnection {
    ws: WebSocket;
    token: string;
    flag: boolean = false;
    heartbeat: any;
    onOpenEvent?: (event: any) => void;
    onMessageEvent: (event: any) => void;
    onErrorEvent?: (event: any) => void;
    onCloseEvent?: (event: any) => void;

    constructor(url: string, token: string, onMessage: (event: any) => void, onOpen?: (event: any) => void, onError?: (event: any) => void, onClose?: (event: any) => void) {
        this.ws = new WebSocket(url, "http");
        this.token = token;
        this.onOpenEvent = onOpen;
        this.onMessageEvent = onMessage;
        this.onErrorEvent = onError;
        this.onCloseEvent = onClose;
        this.ws.onopen = this.onOpen;
        this.ws.onmessage = this.onMessage;
        this.ws.onerror = this.onError;
        this.ws.onclose = this.onClose;
    }

    sendMessage = (data: string) => {
        this.ws.send(data);
    }
    
    //indicates that the connection is ready to send and receive data
    onOpen = (event: any) => {
        console.log("connected");
        this.ws.send(this.token);

        this.heartbeat = setInterval(() => {
            this.ws.send("ping");
            this.flag = false;
            this.waitResponse();
        }, 55000);

        if(this.onOpenEvent)
            this.onOpenEvent(event);
    }
    
    waitResponse = () => {
        setTimeout(() => {
            if(!this.flag) {
                console.log("Does not reveive pong after ping! Connection is going to close.");
                this.ws.close();
            }
        }, 5000);
    }

    //An event listener to be called when a message is received from the server
    onMessage = (event: any) => {        
        if(event.data === "pong") {
            this.flag = true;
            return;
        }

        this.onMessageEvent(event);
    }
    
    //An event listener to be called when an error occurs. This is a simple event named "error".
    onError = (event: any) => {
        console.log(JSON.stringify(event.data));
        if(this.onErrorEvent)
            this.onErrorEvent(event);
    }
    
    //An event listener to be called when the WebSocket connection's readyState changes to CLOSED.
    onClose = (event: any) => {
        clearInterval(this.heartbeat);
        if(this.onCloseEvent)
            this.onCloseEvent(event);
    }
}