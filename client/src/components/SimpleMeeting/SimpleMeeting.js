import { Button, Grid, TextField, Typography } from "@material-ui/core";
import queryString from "query-string";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SocketContext } from "../../contexts/SocketContext";
import {
    createInitiatorPeer,
    createReceivingPeer,
    getUserDataStream,
    setVideoTracksState,
} from "../../utils/webRTC";
import ChessBoardContainer from "../ChessBoardContainer/ChessBoardContainer";
import Messages from "../Messages/Messages";
import Video from "../Video/Video";
import VideoScreen from "../VideoScreen/VideoScreen";
import "./SimpleMeeting.css";

const SimpleMeeting = ({ location }) => {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [camToggled, setCamToggled] = useState(true);

    const [peers, setPeers] = useState([]);
    const peersRef = useRef([]);

    const userVideoElement = useRef();
    const userVideoStream = useRef();

    const { socket } = useContext(SocketContext);


    useEffect(() => {
        const { parsedName, parsedRoom } = updateRoomInfoFromLocation();
        getUserDataStream().then((stream) => {
            userVideoStream.current = stream;
            userVideoElement.current.srcObject = stream;
            socket.emit("join room", { name: parsedName, room: parsedRoom }, (allUsers) => {
                const newPeers = [];
                allUsers.forEach((user) => {
                    const peer = createReceivingPeer(user.id, socket.id, stream, socket);
                    peersRef.current.push({
                        peerID: user.id,
                        peer,
                    });
                    newPeers.push(peer);
                });
                setPeers(newPeers);
            });

            socket.on("user joined", (payload) => {
                const peer = createInitiatorPeer(payload.signal, payload.callerID, stream, socket);
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
                console.log(
                    "aft",
                    peers.filter((p) => p.id !== user.id)
                );
                return peers.filter((p) => p.id !== user.id);
            });
        });

        return () => {
            socket.emit("leaveRoom", null);
            console.log("Disconnecting");
        };
    }, [socket]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit("sendMessage", message, () => {
                setMessage("");
            });
        }
    };

    const toggleCam = () => {
        setVideoTracksState(userVideoStream.current, !camToggled);
        setCamToggled(!camToggled);
    };


    const updateRoomInfoFromLocation = () => {
        const { name, room } = queryString.parse(location.search);
        setName(name);
        setRoom(room);
        return { parsedName: name, parsedRoom: room };
    };

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
                            <video ref={userVideoElement} muted autoPlay />
                        </VideoScreen>

                        {peers.map((peer, i) => (
                            <VideoScreen key={i} userName={peer.name}>
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
