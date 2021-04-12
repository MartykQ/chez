import React from "react";
import "./VideoScreen.css";

const VideoScreen = (props) => {
    return <div className="videoElement">{props.children}</div>;
};

export default VideoScreen;
