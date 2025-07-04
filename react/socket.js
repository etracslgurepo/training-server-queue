// Server side (Node.js with Express and Socket.IO)
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
import SocketContext from "../stores/socket";

let data = {};

// Configure body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle HTTP request from eTracs queue client
app.post("/etracs-post", (req, res) => {
  console.log("Connected to endpoint");
  const { group, section, takeNumber, finishNumber } = req.body;
  data = { group, section, takeNumber, finishNumber };
  io.emit("etracs-data", data);
  res.sendStatus(200);
});

app.get("/etracs-get", (req, res) => {
  const socketCtx = useContext(SocketContext);
  socketCtx.emit("send-message", { group, section, ticket });
  res.json(data);
});

// Start the server
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
