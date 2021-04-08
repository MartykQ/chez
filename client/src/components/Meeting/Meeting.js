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
    const [usersInCall, setUsersInCall] = useState(['me']);

    const myVideoRef = useRef(null);
    const strangerVideoRef = useRef(null);


    const updateRoomInfoFromLocation = () => {

        const {name, room} = queryString.parse(location.search);
        setName(name);
        setRoom(room);
        return { parsedName: name, parsedRoom: room }
    }

    const getUserDataStream = () => {

        let audio = false;
        let video = true;
        return new Promise( (resolve, reject) => {
            navigator.mediaDevices.getUserMedia({video, audio})
                .then(dataStream => {
                    resolve(dataStream);
                }).catch(() => {
                    resolve(null);
                })
        })
    }

    const attachStreamToVideo = (stream, videoRef) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
    } 

    const answerCall = (call, stream) => {
        console.log("Answering a call")
        call.answer(stream)
        call.on('stream', strangerVideoStream => {
            attachStreamToVideo(strangerVideoStream, strangerVideoRef);
        })
    }

    const callNewPeer = (peerId, stream) => {
        console.log(`Calling new user: ${peerId}`)
        const call = myPeer.call(peerId, stream);
        call.on('stream', strangerVideoStream => {
            attachStreamToVideo(strangerVideoStream, strangerVideoRef);
        })
    }

    useEffect(() => {

        const { parsedName, parsedRoom } = updateRoomInfoFromLocation();

        socket = io(SOCKET_ENDPOINT, connectionOptions);
        myPeer = new Peer();

        myPeer.on('open', peerId => {

            console.log("Setting my peer to ", peerId);
            setMyPeerId(peerId);

            getUserDataStream().then(stream => {
                
                attachStreamToVideo(stream, myVideoRef);
                
                console.log(`Joinging with info ${{name: parsedName, room: parsedRoom, peerId}}`);
                socket.emit('join', {name: parsedName, room: parsedRoom, peerId});

                console.log("Ready to answer...")
                myPeer.on('call', (call) => answerCall(call, stream));

                socket.on('user-connected', (peerId) => {
                    callNewPeer(peerId, stream);
                    setUsersInCall([...usersInCall, peerId])
                })
            })
            .catch(err => {
                console.error("error when getting user media", err);
            });
        })

        socket.on('user-disconnected', ({peerId}) => {
            console.log(`${peerId} has disconnected`)
        })

        socket.on('message', (message) => {
            setMessages(messages => [...messages, message]);
        })


        return () => {
            //Unmounting
            console.log("When disc my peer is:", myPeerId)
            socket.emit('my_disconnect', {name, room, myPeerId});
            socket.off();
        };
    }, [location.search, SOCKET_ENDPOINT, myVideoRef]);


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
                <div><video ref={myVideoRef} width={100} height={100}/></div>
                <div><video ref={strangerVideoRef}  width={100} height={100}/></div>
            </div>

            <div>
                {usersInCall.map((u, i) => <div key={i}>{u}</div>)}
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