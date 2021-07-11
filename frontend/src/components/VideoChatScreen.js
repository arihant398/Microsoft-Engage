import React from "react";
import VideoPlayer from "./VideoPlayer";
import Options from "./Options";
import Notifications from "./Notifications";
import { ContextProvider } from "../SocketContext";

// Component which provieds the main video screen with the required context
const VideoChatScreen = ({ isOnlyChat }) => {
    return (
        <>
            <ContextProvider>
                <Options>
                    <Notifications />
                </Options>
                <VideoPlayer isOnlyChat={isOnlyChat} />
            </ContextProvider>
        </>
    );
};

export default VideoChatScreen;
