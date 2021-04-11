const express = require( "express" );
const logger = require("../services/Logger");



class ExpressLoader {
    constructor () {
        app = express();
        server = http.createServer(app);
        io = socketio(server);
    }
}




module.exports = ExpressLoader;