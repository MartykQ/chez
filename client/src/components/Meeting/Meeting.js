import React, { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import Messages from "../Messages/Messages";
import Peer from "peerjs";
import { Link } from "react-router-dom";
import useDynamicRefs from "use-dynamic-refs";
import "./Meeting.css";
import VideoScreen from '../VideoScreen/VideoScreen';


let socket;
let myPeer;
const SOCKET_ENDPOINT = "localhost:5000";
var connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const Meeting = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [myPeerId, setMyPeerId] = useState(null);

  const [usersInCall, setUsersInCall] = useState([]);
  const [getVideoRef, setVideosRef] = useDynamicRefs();

  const myVideoRef = useRef(null);
  const strangerVideoRef = useRef(null);

  const updateRoomInfoFromLocation = () => {
    const { name, room } = queryString.parse(location.search);
    setName(name);
    setRoom(room);
    return { parsedName: name, parsedRoom: room };
  };

  const getUserDataStream = () => {
    let audio = true;
    let video = true;
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

  const attachStreamToVideo = (stream, videoRef) => {
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  };

  const answerCall = (call, stream) => {
    console.log("Answering a call");
    call.answer(stream);
    call.on("stream", (strangerVideoStream) => {
      addUserToVideoCall(call.peer, strangerVideoStream);
    });
  };

  const callNewPeer = (peerId, stream) => {
    console.log(`Calling new user: ${peerId}`);
    const call = myPeer.call(peerId, stream);
    call.on("stream", (strangerVideoStream) => {
      //attachStreamToVideo(strangerVideoStream, strangerVideoRef);

      //
      addUserToVideoCall(peerId, strangerVideoStream);
    });
  };

  const addUserToVideoCall = (peerId, stream) => {
    let foundRef = getVideoRef(peerId);
    console.log(foundRef, peerId);
    foundRef.current.srcObject = stream;
    foundRef.current.play();
  };

  useEffect(() => {
    const { parsedName, parsedRoom } = updateRoomInfoFromLocation();

    socket = io(SOCKET_ENDPOINT, connectionOptions);
    myPeer = new Peer();

    myPeer.on("open", (peerId) => {
      console.log("Setting my peer to ", peerId);
      setMyPeerId(peerId);

      getUserDataStream()
        .then((stream) => {
          attachStreamToVideo(stream, myVideoRef);

          console.log(
            `Joinging with info ${{
              name: parsedName,
              room: parsedRoom,
              peerId,
            }}`
          );
          socket.emit(
            "join",
            { name: parsedName, room: parsedRoom, peerId },
            (data) => {
              console.log(data);
              setUsersInCall(data.map((o) => o.peerId));
            }
          );

          console.log("Ready to answer...");
          myPeer.on("call", (call) => answerCall(call, stream));

          socket.on("user-connected", (peerId) => {
            setUsersInCall([...usersInCall, peerId]);
            callNewPeer(peerId, stream);
          });
        })
        .catch((err) => {
          console.error("error when getting user media", err);
        });
    });

    socket.on("user-disconnected", (data) => {
      console.log(`${data.peerId} has disconnected`);
      setUsersInCall(usersInCall.filter((u) => u.id !== data.peerId));
    });

    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      //Unmounting
      console.log("When disc my peer is:", getMyPeerId());
      socket.disconnect({ name, room, myPeerId });
      myPeer.destroy();
      console.log("ok..");
    };
  }, [location.search, SOCKET_ENDPOINT, myVideoRef]);

  const getMyPeerId = () => {
    return myPeerId;
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => {
        setMessage("");
      });
    }
  };

  console.log("Rendering component");
  return (
    <React.Fragment>
      <h1>Meeting in room '{room}'</h1>
      <Link to="/">
        <button type="submit">Leave</button>
      </Link>

      <div className="videoGrid">
        <VideoScreen>
          <video
            ref={myVideoRef}
            className="myCamera"
          />
        </VideoScreen>
        {usersInCall.map((user, i) => (
          <VideoScreen userName={user}>
            <video
              className="videoRefStyle"
              key={i}
              ref={setVideosRef(user)}
            ></video>
          </VideoScreen>
        ))}
      </div>

      <div className="outerContainer">
        <div className="container">
          <Messages messages={messages} name={name} />
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Meeting;
