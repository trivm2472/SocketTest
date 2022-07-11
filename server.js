const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require('./utils/message.js');
const {userJoin, getCurrentUser, userLeave} = require('./utils/user.js')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

io.on("connection", socket => {
    console.log('New member join');

    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.emit("message", formatMessage("Admin Bot", "Welcome to the chat"));

        socket.broadcast.to(user.room).emit("message", formatMessage("Admin Bot", `${user.username} has join the chat`));
    })
    
    socket.on('chatMessage', message => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(`${user.username}`, message))
    });

    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit("message", formatMessage("Admin Bot", `${user.username} has left the chat room`));
        }
    });

});

app.use(express.static(path.join(__dirname, 'public')));
server.listen(PORT, () => {console.log(`Server is running on ${PORT}`)});