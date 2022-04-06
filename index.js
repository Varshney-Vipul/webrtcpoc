var express = require("express");
const app = express();
var server = require("http").Server(app);
var cors = require("cors");

// var cors = require('cors');
var io = require("socket.io")(server, {
  serveClient: true,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.set("socket-io", io);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = 8090;
server.listen(PORT, () => console.log(`listening to ${PORT}`));

io.on("connection", (socket) => {
  console.log(socket.id + " Connected!");
  socket.on("hello", () => {
    console.log("client said hello !");
  });
});
