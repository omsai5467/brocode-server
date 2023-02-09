const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
// const { Server } =
const io = require("socket.io")(server, {
  maxHttpBufferSize: 1e8,
  pingTimeout: 60000,
});

const socketConnections = [];

const WaveFile = require("wavefile").WaveFile;

const fs = require("fs");
let x = 10;
let au = [];
const ffmpeg = require("fluent-ffmpeg");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/audio", (req, res) => {
  res.sendFile(__dirname + "/hello.wav");
});
app.get("/pcm", (req, res) => {
  console.log("smsending ");
  res.sendFile(__dirname + "/pcm-player.js");
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socketConnections.push(socket.id);
  sendInformation(socket.id);

  socket.on("e#pcm-buffer", (audioData) => {
    console.log("hii");
    // console.log("emiting audio data");
    // let wav = new WaveFile();
    // wav.fromScratch(2, 44100, "16", audioData);

    // fs.writeFileSync("hello.wav", wav.toBuffer());

    socket.broadcast.emit("audiodata", audioData);
  });

  socket.on("*", function (event, data) {
    console.log(event);
    console.log(data);
  });
});

server.listen(80, () => {
  console.log("listening on *:3000");
});

// start sending pcm data to the server
function sendInformation(id) {
  console.log("req --- client")
  io.to(id).emit("e#pcm-send-mono", "stat");
    console.log("req --- sent to client")

}
