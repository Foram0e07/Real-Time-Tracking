const express = require('express');
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", function(socket) {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("send-location", function(data){
        console.log(`Location sent by ${socket.id}:`, data);
        io.emit("receive-location", {id: socket.id, ...data});
    });

    socket.on("disconnect", function(){
        console.log(`Socket disconnected: ${socket.id}`);
        io.emit("user-disconnected", socket.id);
    });
});

app.get("/", function(req, res) {
    res.render("index");
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
