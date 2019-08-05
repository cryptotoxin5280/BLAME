// subscribe.js

const express = require('express');
const http = require('http');
const redisSub = require('redis').createClient();
const socketIo = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const socket = socketIo(httpServer);

redisSub.on("connect", () => {
  console.log("Connected to Redis...");
});

redisSub.on("error", (err) => {
  console.log("Problem connecting to Redis!");
});

redisSub.on("message", (channel, message) => {

  switch(channel) {
    case "insert-job":
      socket.emit("insert-job", message);
      break;

    case "update-job-status":
      socket.emit("update-job-status", message);
      break;

    default:
  }

});
redisSub.subscribe("insert-job");
redisSub.subscribe("update-job-status");

httpServer.listen(3002, () => console.log('GOT HERE'));
