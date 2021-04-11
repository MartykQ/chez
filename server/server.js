const logger = require("./services/Logger");
const config = require("./config")



const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');




const {addUser, getUser, removeUser, getUserInRoom,  getAllConnectedUsers } = require('./users.js');
const { use, get } = require('./router');


const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);


io.on('connection', (socket) => {

    socket.on('join', (data, callback) => {

        console.log(data)
        const { name, room, peerId} = data;
        //User joined a room
        console.log(`${name} joined to ${room}`);
        

        const {error, user} = addUser({id: socket.id, name, room, peerId});
        if(error) {
            console.log("Error adding user..")
            return;
        };
        callback(getUserInRoom(room).filter(u => u.id !== socket.id));

        socket.join(user.room)
        
        socket.emit('message', { user: 'server', text: `${user.name} welcome in a ${user.room} peer ${peerId}` });
        socket.broadcast.to(user.room).emit('message', {user: 'server', text: `Glados: ${user.name} welcome in a ${user.room}`})

        console.log("Sending info that user joined...")
        socket.broadcast.to(user.room).emit('user-connected', peerId)
        

    });


    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', { user: user.name,  text: message});
        callback();
    })

    socket.on('disconnect', ({name, room, peerId}) => {
        user = getUser(socket.id);
        console.log(`${user.name} Disconneccted..`);
        socket.broadcast.to(user.room).emit('user-disconnected', user)
        removeUser(socket.id);
        console.log(getAllConnectedUsers());
    })
})

app.use(router);

server.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})