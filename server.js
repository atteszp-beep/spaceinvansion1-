const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let rooms = {};

function getRoom(r){
    if(!rooms[r]) rooms[r] = { players:{}, bullets:[], enemies:[] };
    return rooms[r];
}

io.on("connection", (socket) => {

    socket.on("join", (data) => {
        socket.room = data.room;
        const room = getRoom(data.room);

        room.players[socket.id] = {
            x: 500,
            y: 500,
            angle: 0,
            hp: 100,
            score: 0,
            skin: data.skin,
            username: data.username
        };
    });

    socket.on("move", (data) => {
        const room = getRoom(socket.room);
        if(room.players[socket.id]){
            room.players[socket.id] = {
                ...room.players[socket.id],
                ...data
            };
        }
    });

    socket.on("shoot", (data) => {
        const room = getRoom(socket.room);
        room.bullets.push(data);
    });

    socket.on("disconnect", () => {
        for(let r in rooms){
            delete rooms[r].players[socket.id];
        }
    });
});

setInterval(() => {
    for(let r in rooms){
        const room = rooms[r];

        room.bullets.forEach(b => {
            b.x += Math.cos(b.angle) * 10;
            b.y += Math.sin(b.angle) * 10;
        });

        io.emit("state", room);
    }
}, 30);

server.listen(8086, () => console.log("Server running http://localhost:8086"));