const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("this is working fine no need to worry about anything right ");
});

server.listen(3000, () => {
  console.log("server running on port 3000");
});

const webSocketServer = new Server(server);

let users_count = 0;
let total_online = 0;

webSocketServer.on("connection", (socket) => {
  users_count++;

  // joining new member and sending others his or her indentity
  webSocketServer.emit("users_count", users_count);
  socket.on("joined", (member) => {
    total_online++;
    socket.broadcast.emit("new_member", `${member} joined chat`);

    // total online update
    webSocketServer.emit("total_online", total_online);
});

// receiving messagees
socket.on("receive", (msg) => {
    socket.broadcast.emit("new_received", msg);
});

// disconnection and updating the online no of usrs
socket.on("disconnect", () => {
    users_count--;
    total_online--;
    webSocketServer.emit("total_online", total_online);
    socket.broadcast.emit("users_count", users_count);
  });
});
