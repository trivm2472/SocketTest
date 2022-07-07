const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require('./utils/message.js');
const {userJoin, getCurrentUser} = require('./utils/user.js')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

io.on("connection", socket => {
    console.log('New member join');

    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.emit("message", formatMessage("Admin Bot", "Welcome to the chat"));

        socket.broadcast.emit("message", formatMessage("Admin Bot", "A user has join the chat"));
    })
    
    socket.on("disconnect", () => {
        io.emit("message", formatMessage("Admin Bot", "A user has left the chat room"));
    });

    socket.on('chatMessage', message => {
        io.emit('message', formatMessage("USER", message))
    });
});

app.use(express.static(path.join(__dirname, 'public')));
server.listen(PORT, () => {console.log(`Server is running on ${PORT}`)});