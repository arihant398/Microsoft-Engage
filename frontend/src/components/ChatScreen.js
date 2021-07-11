import React from "react";
import MainChat from "./MainChat";
import { ChatRoomContextProvider } from "../ChatRoomContext";

//Component used to provide the Main Chat Screen with necessary data using context
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
