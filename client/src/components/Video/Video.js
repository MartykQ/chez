import React, { useRef, useEffect } from "react";

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        console.log("Mounting video with", props.peer);

        props.peer.on("stream", (stream) => {
            console.log("VIDEO stream received!!");
            ref.current.srcObject = stream;
        });
    }, []);

    return <video ref={ref} autoPlay playsInline></video>;
};

export default Video;
