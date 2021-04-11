import React from "react";
import "./VideoScreen.css";

const VideoScreen = (props) => {
    console.log("asd", props.userName);
    return <div className="videoElement">{props.children}</div>;
};

export default VideoScreen;
