var express = require("express");
const app = express();
var server = require("http").Server(app);
var cors = require("cors");

const roomCode = "sdfjhl";

// var cors = require('cors');
var io = require("socket.io")(server, {
  serveClient: true,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const membersArray = [];

app.use(cors());
app.set("socket-io", io);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8090;
}
server.listen(port, () => console.log(`listening to ${port}`));

io.on("connection", (socket) => {
  socket.join(socket.id.toString());
  console.log(socket.id + " Connected!");
  io.emit("indeed", "client said hello !");
  socket.on("hello", () => {
    io.emit("indeed", "client said hello !");
  });

  socket.on("fetch-lobby-details", () => {
    if (membersArray.length < 2) {
      membersArray.push(socket.id);
      socket.join(roomCode);
      var toSend = {
        success: true,
        roomCode: roomCode,
      };

      if (membersArray.length === 1) {
        toSend.role = "caller";
      } else {
        toSend.role = "receiver";
      }
      io.to(socket.id.toString()).emit("lobby-details", toSend);
    }
  });

  socket.on("peer-offer", (data) => {
    socket.to(roomCode).emit("remote-peer-offer", data);
  });

  socket.on("peer-answer", (data) => {
    socket.to(roomCode).emit("remote-peer-answer", data);
  });

  socket.on("peer-ice-candidate", (data) => {
    socket.to(roomCode).emit("remote-peer-ice-candidate", data);
  });

  socket.on("disconnect", () => {
    const temp = membersArray.indexOf(socket.id);
    if (temp >= 0) {
      membersArray.splice(temp, 1);
    }
  });
});
