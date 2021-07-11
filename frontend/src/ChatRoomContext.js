import React, { createContext, useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const ChatRoomContext = createContext();

const ChatRoomContextProvider = ({ children }) => {
    const [messages, setMessages] = useState({});
    const [name, setName] = useState("");
    const socket = useRef();
    //const roomID = window.location.pathname.slice(6);
    const [users, setUsers] = useState({});
    const [me, setMe] = useState();
    const [roomID, setRoomID] = useState(window.location.pathname.slice(6));

    const user_mail = localStorage.getItem("user-email");

    useEffect(() => {
        socket.current = io("https://union-server-final.herokuapp.com/", {
            "sync disconnect on unload": true,
        });
        socket.current.emit("join-chat-room", roomID);

        socket.current.on("chatMe", (socket) => {
            setMe(socket);
        });

        socket.current.on("allChatUsers", (users) => {
            setUsers(users);
        });

        socket.current.on("updateChatMessage", (messages) => {
            setMessages(messages);
        });

        socket.current.on("chatMessageReceived", (message) => {
            setMessages(message);
            console.log("All Message");
        });
    }, []);

    function sendMessage(text, room) {
        socket.current.emit("chatMessageSent", {
            text,
            name,
            rID: room,
            id: me,
            senderMail: user_mail,
        });
    }

    return (
        <ChatRoomContext.Provider
            value={{
                messages,
                sendMessage,
                users,
                name,
                setName,
                setRoomID,
                roomID,
                me,
            }}
        >
            {children}
        </ChatRoomContext.Provider>
    );
};

export { ChatRoomContextProvider, ChatRoomContext };
