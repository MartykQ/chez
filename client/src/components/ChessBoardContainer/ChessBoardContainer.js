import React, { useEffect, useContext } from 'react';
import Chessboard from "chessboardjsx";
import { SocketContext } from '../../SocketContext';


const ChessBoardContainer = (props) => {

    const socket = useContext(SocketContext);

    useEffect(() => {
        console.log("Mounting chessboard");
        socket.on("message", (message) => {
            console.log("XD");
        });
    }, [])

    return (
        <Chessboard position="start" />
    )
}

export default ChessBoardContainer;