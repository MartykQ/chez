import Peer from "simple-peer";

export function createReceivingPeer(userToSignal, callerID, stream, socket) {
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

export function createInitiatorPeer(incomingSignal, callerID, stream, socket) {
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


export const getUserDataStream = (audio = true, video = true) => {
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


export const setVideoTracksState = (stream, status) => {
    stream.getVideoTracks().forEach((track) => {
        track.enabled = status;
    });
}