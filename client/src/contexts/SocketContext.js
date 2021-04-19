import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

const SOCKET_ENDPOINT = "localhost:5000";
var connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
};

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(io(SOCKET_ENDPOINT, connectionOptions));

    useEffect(() => {
        //initSocket();
    }, []);

    const initSocket = () => {
        const newSocket = io(SOCKET_ENDPOINT, connectionOptions);
        setSocket(newSocket);
    };

    const destroySocket = () => {
        socket.disconnect();
        initSocket();
    };

    return (
        <SocketContext.Provider value={{ socket, initSocket, destroySocket }}>
            {children}
        </SocketContext.Provider>
    );
};
