const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());

const PORT = process.env.PORT || 5000;
const id = uuidv4();
console.log(id);

app.get("/", (req, res) => {
    res.send("Server is Running");
});

const users = {};
const socketToRoom = {};
//Socket.io:
io.on("connection", (socket) => {
    socket.on("join-room", (room) => {
        if (!users[room]) {
            users[room] = [socket.id];
        } else {
            users[room].push(socket.id);
        }
        socketToRoom[socket.id] = room;
        //const usersInThisRoom = users[room].filter((id) => id !== socket.id);
        io.sockets.emit("allUsers", users);
        socket.emit("me", socket.id);

        socket.on("disconnect", () => {
            delete users[room][socket.id];
            socket.broadcast.emit("callended");
        });

        socket.on("calluser", ({ userToCall, signalData, from, name }) => {
            io.to(userToCall).emit("calluser", {
                signal: signalData,
                from,
                name,
            });
        });

        socket.on("answercall", (data) => {
            io.to(data.to).emit("callaccepted", data.signal);
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
});
