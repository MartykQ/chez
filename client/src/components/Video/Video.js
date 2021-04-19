import React, { useRef, useEffect } from "react";

const Video = (props) => {
    const videoREf = useRef();

    useEffect(() => {
        props.peer.on("stream", (stream) => {
            console.log("VIDEO stream received!!");
            videoREf.current.srcObject = stream;
        });
    }, [props.peer]);

    return <video ref={videoREf} autoPlay playsInline></video>;
};

export default Video;
