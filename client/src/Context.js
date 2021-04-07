import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

let socket;
const SOCKET_ENDPOINT = 'localhost:5000'
var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
};


const ContextProvider = ({ children }) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {

    }, [])


    return (
        <div></div>
    )

}