import React from "react";
import VideoPlayer from "./VideoPlayer";
import Options from "./Options";
import Notifications from "./Notifications";
import { ContextProvider } from "../SocketContext";

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
