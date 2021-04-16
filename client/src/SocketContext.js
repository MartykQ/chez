import React, { createContext}  from 'react';
import io from "socket.io-client";

const SOCKET_ENDPOINT = "localhost:5000";
var connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
};

console.log("Connecting to socket")
export const socket = io(SOCKET_ENDPOINT, connectionOptions);
export const SocketContext = createContext(null);
