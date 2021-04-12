const express = require("express");
const logger = require("../services/Logger");
const config = require("../config");
const cors = require("cors");
const routes = require("../routes");
const http = require("http");

class ExpressLoader {
  constructor() {
    const app = express();
    const server = http.createServer(app);

    const PORT = process.env.PORT || 5000;

    app.get("/status", (req, res) => {
      res.status(200).end();
    });
    app.head("/status", (req, res) => {
      res.status(200).end();
    });

    app.enable("trust proxy");

    app.use(cors());

    app.use(routes);

    this.server = server.listen(PORT, () => {
      console.log(`Server started on ${PORT}`);
      logger.info(`Server started on ${PORT}`);
    });
  }
  get Server() {
    return this.server;
  }
}

module.exports = ExpressLoader;
