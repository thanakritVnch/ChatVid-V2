const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const { addUser, removeUser, getUser, getUserInRoom } = require("./users");

app.use(router);

//io socket conn&discon
io.on("connection", (socket) => {
  console.log("new connect establishment");

  // emit recieving from front-end
  socket.on("join", ({ name, room }, callback) => {
    // console.log(name, room);
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);
    //Admin generate message broadcasting
    socket.emit("message", {
      user: "Admin",
      text: `welcome to room: ${user.room} user : ${user.name}`,
    });

    socket.broadcast.to(user.room).emit("message", {
      user: "Admin",
      text: `${user.name} has joined chat room`,
    });

    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });

    callback();
  });

  //user generate message

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });

    callback();
  });

  io.on("disconnect", (socket) => {
    const user = removeUser(socket.id);
    // console.log("user disconnect");
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left the room`,
      });
    }
  });
});

server.listen(PORT, () => console.log(`server is runing on port: ${PORT}`));
