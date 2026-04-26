const socket = io();

const c = document.getElementById("game");
const ctx = c.getContext("2d");

const radar = document.getElementById("radar");
const rctx = radar.getContext("2d");

let myId;
let players = {};
let drones = [];
let lasers = [];
let mode = "lobby";

let keys = {};

// INPUT
document.addEventListener("keydown", e => {
    keys[e.key] = true;
    if (e.key === " ") socket.emit("shoot");
});

document.addEventListener("keyup", e => keys[e.key] = false);

socket.on("connect", () => myId = socket.id);

// MODE
function select(m) {
    socket.emit("selectMode", m);
}

socket.on("mode", d => {
    mode = d.mode;
    document.getElementById("mode").innerText = mode;
});

// STATE
socket.on("state", s => {
    players = s.players;
    drones = s.drones;
    lasers = s.lasers;
});

// LOOP
function loop() {

    let me = players[myId];

    if (me) {

        if (keys["ArrowUp"]) me.y -= 5;
        if (keys["ArrowDown"]) me.y += 5;
        if (keys["ArrowLeft"]) me.x -= 5;
        if (keys["ArrowRight"]) me.x += 5;

        socket.emit("move", me);

        document.getElementById("shield").innerText = me.shield;
    }

    draw();
    drawRadar();

    requestAnimationFrame(loop);
}

// DRAW SCI-FI WORLD
function draw() {

    // space background
    ctx.fillStyle = "#02010a";
    ctx.fillRect(0, 0, 900, 600);

    // lasers (neon)
    lasers.forEach(l => {
        ctx.fillStyle = "#00ffff";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#00ffff";
        ctx.fillRect(l.x, l.y, 3, 3);
        ctx.shadowBlur = 0;
    });

    // drones
    drones.forEach(d => {
        ctx.fillStyle = "#ff00ff";
        ctx.fillRect(d.x, d.y, 18, 18);
    });

    // players
    for (let id in players) {
        let p = players[id];

        ctx.fillStyle = "#00ff88";
        ctx.fillRect(p.x, p.y, 20, 20);
    }
}

// RADAR (SCI-FI HUD)
function drawRadar() {

    rctx.fillStyle = "rgba(0,0,20,0.8)";
    rctx.fillRect(0, 0, 200, 200);

    let me = players[myId];
    if (!me) return;

    let scale = 0.15;

    drones.forEach(d => {
        rctx.fillStyle = "#ff00ff";
        rctx.fillRect((d.x - me.x) * scale + 100, (d.y - me.y) * scale + 100, 3, 3);
    });

    for (let id in players) {
        let p = players[id];

        rctx.fillStyle = "#00ff88";
        rctx.fillRect((p.x - me.x) * scale + 100, (p.y - me.y) * scale + 100, 4, 4);
    }

    rctx.fillStyle = "#00ffff";
    rctx.fillRect(100, 100, 4, 4);
}

loop();