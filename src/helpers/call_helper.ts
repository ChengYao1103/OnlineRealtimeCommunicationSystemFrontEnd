import React from "react";
import { io } from "socket.io-client";

const socket = io("wss://orcs-dev-signaling.beeenson.com", {
  transports: ["websocket"],
});

export { socket };

export const socketContext = React.createContext(socket);
