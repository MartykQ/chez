const socketio = require("socket.io");
const socker = require("../socker");

module.exports = class SocketLoader {
  constructor(server) {
    const io = socketio(server);
    socker(io);
  }
};
