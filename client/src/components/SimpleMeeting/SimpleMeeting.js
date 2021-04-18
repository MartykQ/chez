import { Button, Grid, TextField, Typography } from "@material-ui/core";
import queryString from "query-string";
import React, { useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Peer from "simple-peer";
import io from "socket.io-client";
import Messages from "../Messages/Messages";
import Video from "../Video/Video";
import VideoScreen from "../VideoScreen/VideoScreen";
import ChessBoardContainer from "../ChessBoardContainer/ChessBoardContainer";
import { SocketContext } from "../../SocketContext";

import "./SimpleMeeting.css";

// const SOCKET_ENDPOINT = "https://chez-backend.herokuapp.com";
const SOCKET_ENDPOINT = "localhost:5000";
var connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
};

const SimpleMeeting = ({ location }) => {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [camToggled, setCamToggled] = useState(true);

    const [peers, setPeers] = useState([]);
    const peersRef = useRef([]);
    const userVideo = useRef();
    const {socket, initSocket, destroySocket} = useContext(SocketContext);
    const userVideoStream = useRef();

    useEffect(() => {
        console.log("Simple meeting MOUNTED")
        const { parsedName, parsedRoom } = updateRoomInfoFromLocation();
        console.log(socket);
        getUserDataStream().then((stream) => {
            userVideoStream.current = stream;
            userVideo.current.srcObject = stream;
            socket.emit("join room", { name: parsedName, room: parsedRoom }, (allUsers) => {
                const peers = [];
                allUsers.forEach((user) => {
                    const peer = createPeer(user.id, socket.id, stream);
                    peersRef.current.push({
                        peerID: user.id,
                        peer,
                    });
                    peers.push(peer);
                });
                setPeers(peers);
            });

            socket.on("user joined", (payload) => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                });

                setPeers((users) => [...users, peer]);
            });

            socket.on("receiving returned signal", (payload) => {
                const item = peersRef.current.find((p) => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        });

        socket.on("message", (message) => {
            if (message.text === "clear") {
                setMessages([]);
            } else setMessages((messages) => [...messages, message]);
        });

        socket.on("user-disconnected", (user) => {
            console.log(`${user.name} has disconnected ${user.id}`);
            setPeers((peers) => {
                console.log("prev: ", peers);
                console.log("aft", peers.filter((p) => p.id !== user.id))
                return peers.filter((p) => p.id !== user.id);
            });
        });

        return () => {
            socket.emit("leaveRoom", null);
            console.log("Disconnecting");
        };
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", (signal) => {
            socket.emit("sending signal", { userToSignal, callerID, signal });
        });

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on("signal", (signal) => {
            socket.emit("returning signal", { signal, callerID });
        });

        peer.signal(incomingSignal);

        return peer;
    }

    const updateRoomInfoFromLocation = () => {
        const { name, room } = queryString.parse(location.search);
        setName(name);
        setRoom(room);
        return { parsedName: name, parsedRoom: room };
    };

    const getUserDataStream = (audio = true, video = true) => {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices
                .getUserMedia({ video, audio })
                .then((dataStream) => {
                    resolve(dataStream);
                })
                .catch(() => {
                    resolve(null);
                });
        });
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit("sendMessage", message, () => {
                setMessage("");
            });
        }
    };

    const toggleCam = () => {
        userVideoStream.current.getVideoTracks().forEach((track) => {
            console.log(track);
            track.enabled = !camToggled;
        });
        setCamToggled(!camToggled);
    };

    console.log("Rendering component");
    return (
        <React.Fragment>
            <Typography variant="h3">Simple Meeting in a room {room}</Typography>
            <Link to="/">
                <Button type="submit" variant="contained" color="primary">
                    Leave
                </Button>
            </Link>

            <Grid container direction="row" justify="space-around" alignItems="center">
                <div>
                    <Button onClick={toggleCam}>Hide me</Button>
                    <Grid container direction="column" justify="flex-start" alignItems="center">
                        <VideoScreen>
                            <video ref={userVideo} muted autoPlay />
                        </VideoScreen>

                        {peers.map((peer, i) => (
                            <VideoScreen userName={peer.name}>
                                <Video key={i} peer={peer}></Video>
                            </VideoScreen>
                        ))}
                    </Grid>
                </div>
                <div>
                    <ChessBoardContainer />
                </div>
                <div>
                    <div className="container">
                        <Messages messages={messages} name={name} />
                        <TextField
                            variant="outlined"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
                        />
                    </div>
                </div>
            </Grid>
        </React.Fragment>
    );
};

export default SimpleMeeting;
