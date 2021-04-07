import React, { useEffect, useRef, useState } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Messages from '../Messages/Messages';
import Peer from 'peerjs';

let socket;
let myPeer;
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
    const [myPeerId, setMyPeerId] = useState(null);

    const myVideoRef = useRef(null);
    const strangerVideoRef = useRef(null);


    useEffect(() => {
        console.log(1);

        const { name, room } = queryString.parse(location.search);
        setName(name);
        setRoom(room); 

        socket = io(SOCKET_ENDPOINT, connectionOptions);
        
        
        myPeer = new Peer();
        myPeer.on('open', peerId => {
            console.log("Setting my peer to ", peerId);
            setMyPeerId(peerId);
            navigator.mediaDevices.getUserMedia({ video: true})
            .then(stream => {
                //Got video stream
                let video = myVideoRef.current;
                video.srcObject = stream;
                video.play();
                

                console.log(`Joinging with info ${name}/${room}`);
                socket.emit('join', {name, room, peerId}, (e) => {
                    console.log("Server responded with" + e);
                })

                console.log("Ready to answer...")
                myPeer.on('call', call => {
                    console.log("Answering a call")
                    call.answer(stream)
                    call.on('stream', strangerVideoStream => {
                        strangerVideoRef.current.srcObject = strangerVideoStream;
                        strangerVideoRef.current.play();
                    })
                })

                socket.on('user-connected', ({peerId}) => {
                    console.log(`Calling new user: ${peerId}`)
                    const call = myPeer.call(peerId, stream);
                    call.on('stream', strangerVideoStream => {
                        strangerVideoRef.current.srcObject = strangerVideoStream;
                        strangerVideoRef.current.play();
                    })
                })
            })
            .catch(err => {
                console.error("error:", err);
            });
        })

        socket.on('user-disconnected', ({peerId}) => {
            console.log(`${peerId} has disconnected`)
        })


        return () => {
            //Unmounting
            console.log("When disc my peer is:", myPeerId)
            socket.emit('my_disconnect', {name, room, myPeerId});
            socket.off();
        };
    }, [location.search, SOCKET_ENDPOINT, myVideoRef]);


    useEffect(() => {
        socket.on('message', (message) => {
            setMessages(messages => [...messages, message]);
        })

    }, [])



    //sending messages
    const sendMessage = (e) => {
        e.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, () => {
                setMessage('');
            })
        }
    }

    return (
        <React.Fragment>
            <h1>Meeting</h1>
            <div>
                <div><video ref={myVideoRef}/></div>
                <div><video ref={strangerVideoRef} /></div>
            </div>
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