const logger = require("./services/Logger");
const config = require("./config");
const ExpressLoader = require("./loaders/ExpressLoader");
const SocketsLoader = require("./loaders/SocketsLoader");

const expressLoader = new ExpressLoader();
const server = expressLoader.Server;

const socketsLoader = new SocketsLoader(server);
