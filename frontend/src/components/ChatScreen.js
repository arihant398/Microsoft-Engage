import React from "react";
import MainChat from "./MainChat";
import { ChatRoomContextProvider } from "../ChatRoomContext";

const ChatScreen = () => {
    return (
        <>
            <ChatRoomContextProvider>
                <MainChat />
            </ChatRoomContextProvider>
        </>
    );
};

export default ChatScreen;
