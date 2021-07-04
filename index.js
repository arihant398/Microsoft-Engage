const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

//DATABASE
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected"));

const authRoutes = require("./routes/auth");
const { db } = require("./models/User");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

//middleware
app.use(bodyParser.json());
app.use(cors());

//routes middleware
app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
    app.use(express.static("frontend/build"));
}

app.get("/", (req, res) => {
    res.send("Server is Running");
});

const users = {};
const socketToRoom = {};
const usersInMeeting = {};

const messages = {};

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
            deleteID(users, socket.id, room);
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
            if (!usersInMeeting[room]) {
                usersInMeeting[room] = [socket.id];
            } else {
                usersInMeeting[room].push(socket.id);
            }
            io.to(data.to).emit("callaccepted", {
                signal: data.signal,
                name: data.name,
                sockID: socket.id,
                usersInMeeting,
            });
        });

        socket.on("messageSent", ({ text, name }) => {
            if (!messages[room]) {
                messages[room] = [{ name: name, message: text }];
            } else {
                messages[room].push({ name: name, message: text });
            }
            //console.log("Messages Server", messages);

            io.sockets.emit("messageReceived", messages);
        });
    });
});

function deleteID(array, idToDelete, roomID) {
    for (var i = 0; i < array[roomID].length; i++) {
        if (array[roomID][i] === idToDelete) {
            array[roomID].splice(i, 1);
            return array;
        }
    }
    return array;
}

server.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
});
