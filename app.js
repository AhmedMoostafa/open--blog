const express = require("express");
const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const path = require("path");
const multer = require("multer");
const http = require("http");
const socketio = require("socket.io");
const app = express();

require("./util/database");
const port = process.env.PORT;

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(express.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const msg = error.message;
  res.status(status).json({ message: msg });
});

const server = require("http").Server(app);
const io = require("./socket").init(server);

server.listen(port, () => {
  console.log(`listening on ${port}`);
  io.on("connection", (socket) => {
    console.log("Client connected");
  });
});
