var express = require("express");
const app = express();
var server = require("http").Server(app);
var cors = require("cors");

// var cors = require('cors');
var io = require("socket.io")(server, {
  serveClient: true,
  cors: {
    origin: ".*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.set("socket-io", io);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8090;
}
server.listen(port, () => console.log(`listening to ${PORT}`));

io.on("connection", (socket) => {
  console.log(socket.id + " Connected!");
  socket.on("hello", () => {
    io.emit("indeed", "client said hello !");
  });
});
