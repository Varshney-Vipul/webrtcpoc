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
  console.log(socket.id + " Connected!");
  io.emit("indeed", "client said hello !");
  socket.on("hello", () => {
    io.emit("indeed", "client said hello !");
  });

  socket.on("fetch-lobby-details", () => {
    if (membersArray.length < 2) {
      membersArray.push(socket.id);
      socket.join(roomCode);
      io.to(roomCode).emit("lobby-details", {
        success: true,
        roomCode: roomCode,
      });
    }
  });

  socket.on("disconnect", () => {
    const temp = membersArray.indexOf(socket.id);
    if (temp >= 0) {
      membersArray.splice(temp, 1);
    }
  });
});
