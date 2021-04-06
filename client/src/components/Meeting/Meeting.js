import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import Messages from '../Messages/Messages';


let socket;
const SOCKET_ENDPOINT = 'localhost:5000'
var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
};

const Meeting = ( { location } ) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');


    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        setName(name);
        setRoom(room); 

        socket = io(SOCKET_ENDPOINT, connectionOptions);


        socket.emit('join', {name, room}, (e) => {
            console.log("Server responded with" + e);
        });
        
        return () => {
            //Unmounting
            // socket.emit('disconnect');
            socket.off();

        };


    }, [location.search, SOCKET_ENDPOINT]);


    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);

        })
    }, [messages])


    //sending messages
    const sendMessage = (e) => {
        e.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, () => {
                setMessage('');
            })
        }
    }

    console.log(message, messages)


    return (
        <React.Fragment>
            <h1>Meeting</h1>
            <div className="outerContainer">
                <div className="container">

                    <Messages messages={messages} name={name}/>
                    <input 
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}  />
                </div>
            </div>
        </React.Fragment>
    )
}

export default Meeting;