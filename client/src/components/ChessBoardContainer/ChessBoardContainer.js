import React, { useEffect, useContext } from "react";
import Chessboard from "chessboardjsx";
import { SocketContext } from "../../contexts/SocketContext";

const ChessBoardContainer = (props) => {
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        console.log("Mounting chessboard");
        if (socket) {
            socket.on("message", (message) => {
                console.log("XD");
            });
        }
    }, [socket]);

    return <Chessboard position="start" />;
};

export default ChessBoardContainer;
