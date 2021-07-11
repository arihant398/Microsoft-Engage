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
const { messageDB } = require("./models/RoomMessage");

const RoomMessage = require("./models/RoomMessage");

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
const chatUsers = {};

const messages = {};

//Socket.io:
io.on("connection", (socket) => {
    socket.on("join-room", (room) => {
        if (!users[room]) {
            users[room] = [socket.id];
            usersInMeeting[room] = [socket.id];
        } else {
            users[room].push(socket.id);
        }
        socketToRoom[socket.id] = room;
        io.sockets.emit("allUsers", {
            users,
            usersInMeetingRoom: usersInMeeting,
        });
        socket.emit("me", socket.id);

        socket.emit("updateMessage", messages);

        socket.on("disconnect", () => {
            deleteID(users, socket.id, room);
            deleteID(usersInMeeting, socket.id, room);
            io.sockets.emit("callended", {
                socketID: socket.id,
                users,
                usersInMeeting,
            });
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
            } else if (!searchID(usersInMeeting, data.to, room)) {
                usersInMeeting[room].push(data.to);
            }
            io.to(data.to).emit("callaccepted", {
                signal: data.signal,
                name: data.name,
                sockID: socket.id,
                usersInMeetingRoom: usersInMeeting,
            });
            io.sockets.emit("allUsers", {
                users,
                usersInMeetingRoom: usersInMeeting,
            });
        });

        socket.on("messageSent", ({ text, name, id }) => {
            if (!messages[room]) {
                messages[room] = [{ name: name, message: text, userID: id }];
            } else {
                messages[room].push({ name: name, message: text, userID: id });
            }
            addToMessageDB(room, { name: name, message: text, userID: id });

            io.sockets.emit("messageReceived", messages);
        });

        socket.on("hand-raised", (socketID) => {
            io.sockets.emit("handRaised", socketID);
        });
        socket.on("hand-down", (socketID) => {
            io.sockets.emit("handDown", socketID);
        });
    });

    socket.on("join-chat-room", (room) => {
        if (!chatUsers[room]) {
            chatUsers[room] = [socket.id];
        } else {
            chatUsers[room].push(socket.id);
        }
        socketToRoom[socket.id] = room;
        io.sockets.emit("allChatUsers", chatUsers);
        socket.emit("chatMe", socket.id);

        socket.on("chatDisconnect", () => {
            deleteID(chatUsers, socket.id, room);
        });

        socket.emit("updateChatMessage", messages);

        socket.on("chatMessageSent", ({ text, name, rID, id }) => {
            if (!messages[rID]) {
                messages[rID] = [{ name: name, message: text, userID: id }];
            } else {
                messages[rID].push({ name: name, message: text, userID: id });
            }
            addToMessageDB(rID, { name: name, message: text });

            io.sockets.emit("chatMessageReceived", messages);
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

function searchID(array, idToSearch, roomID) {
    for (var i = 0; i < array[roomID].length; i++) {
        if (array[roomID][i] === idToSearch) {
            return true;
        }
    }
    return false;
}

function addToMessageDB(roomID, message) {
    if (roomID.slice(0, 4) === "chat") {
        roomID = roomID.slice(5);
    }
    RoomMessage.findOne({ roomID: roomID }).then((room) => {
        if (room) {
            room.message.push(message);
            room.save();
        } else {
            const room = new RoomMessage({
                roomID: roomID,
                message: message,
            });
            room.save();
        }
    });
}

server.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
});
