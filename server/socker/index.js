const {
    addUser,
    getUser,
    removeUser,
    getUserInRoom,
    getAllConnectedUsers,
} = require("../services/UserService");

module.exports = socker = (io) => {
    console.log("Registering...");

    io.on("connection", (socket) => {
        socket.on("join room", (data, callback) => {
            const { name, room } = data;
            //User joined a room
            console.log(`${name} joined to ${room}`);

            const { error, user } = addUser({ id: socket.id, name, room });
            if (error) {
                console.log("Error adding user..");
                return;
            }

            // send back all users in that particullar room
            callback(getUserInRoom(room).filter((u) => u.id !== socket.id));

            socket.join(user.room);

            socket.emit("message", {
                user: "server",
                text: `${user.name} welcome in a ${user.room}`,
            });
            socket.broadcast.to(user.room).emit("message", {
                user: "server",
                text: `Glados: ${user.name} welcome in a ${user.room}`,
            });
        });

        socket.on("sendMessage", (message, callback) => {
            console.log("message..");
            const user = getUser(socket.id);
            io.to(user.room).emit("message", { user: user.name, text: message });
            callback();
        });

        socket.on("sending signal", (payload) => {
            io.to(payload.userToSignal).emit("user joined", {
                signal: payload.signal,
                callerID: payload.callerID,
            });
        });

        socket.on("returning signal", (payload) => {
            io.to(payload.callerID).emit("receiving returned signal", {
                signal: payload.signal,
                id: socket.id,
            });
        });

        socket.on("disconnect", ({ name, room }) => {
            user = getUser(socket.id);
            if (user) {
                socket.leave(user.room)
                console.log(`${user.name} Disconneccted..`);
                socket.broadcast.to(user.room).emit("user-disconnected", user);
                removeUser(socket.id);
                console.log(getAllConnectedUsers());
            }

        });
    });
};
