import React, { useContext, useState, useEffect } from "react";
import { ChatRoomContext } from "../ChatRoomContext";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import Chat from "./Chat";
import { UserContext } from "../UserContext";
import { Row, Col } from "react-bootstrap";
import RoomList from "./RoomList";
import { useHistory } from "react-router-dom";

// Component which acts as the main chat screen
const MainChat = () => {
    // Using ChatRoomContext to communicate with the server
    const { messages, sendMessage, setName, setRoomID, roomID, me } =
        useContext(ChatRoomContext);

    // Using UserContext to use data from user
    const { userName, setUserName, userRoomListData, setUserRoomListData } =
        useContext(UserContext);

    const [roomListData, setRoomListData] = useState({});
    const [newRoomID, setNewRoomID] = useState(
        window.location.pathname.slice(6)
    );

    const history = useHistory();
    const [isRoomAdded, setIsRoomAdded] = useState(false);
    // Setting client side user data
    useEffect(() => {
        setNewRoomID(window.location.pathname.slice(6));

        if (localStorage.getItem("user-name")) {
            setUserName(() => localStorage.getItem("user-name"));
            setName(() => localStorage.getItem("user-name"));

            setUserRoomListData(() =>
                JSON.parse(localStorage.getItem("user-room-data"))
            );
            setRoomListData(() =>
                JSON.parse(localStorage.getItem("user-room-data"))
            );
            Object.keys(userRoomListData).map((obj, i) => {
                if (userRoomListData[obj].id === newRoomID) {
                    setIsRoomAdded(true);
                    return;
                }
            });
        } else {
            window.location.replace("/");
        }
    }, []);

    // Updating the messages
    useEffect(() => {
        setMessageList(messages);
    }, [messages]);

    const [newMessage, setNewMessage] = useState("");
    const [messageList, setMessageList] = useState({});

    //Audio To Message
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const stopListeningToAudio = () => {
        SpeechRecognition.stopListening();
        setNewMessage(transcript);
    };

    const listenToAudio = () => {
        resetTranscript();
        SpeechRecognition.startListening({
            continuous: true,
        });
    };

    // Sending Messages to server
    function messageSend(message) {
        sendMessage(message, roomID);
    }

    return (
        <>
            <Row>
                <Col
                    sm={12}
                    md={3}
                    lg={3}
                    xl={3}
                    className="grid-item item2-chat subGrid subGrid-chat-room p-0"
                >
                    <div className="subGrid-item subGrid-item1 roomData">
                        {Object.keys(roomListData).map((obj, i) => {
                            return (
                                <Row
                                    key={roomListData[obj]._id}
                                    style={{ margin: "8px" }}
                                >
                                    <RoomList
                                        roomListData={roomListData[obj]}
                                        setRoomID={setRoomID}
                                    />
                                </Row>
                            );
                        })}
                    </div>
                </Col>
                <Col sm={12} md={9} lg={9} xl={9}>
                    <Chat
                        messages={messages}
                        roomID={newRoomID}
                        listening={listening}
                        transcript={transcript}
                        setNewMessage={setNewMessage}
                        sendMessage={messageSend}
                        listenToAudio={listenToAudio}
                        stopListeningToAudio={stopListeningToAudio}
                        newMessage={newMessage}
                        userid={me}
                        isOnlyChat={true}
                    ></Chat>
                </Col>
            </Row>
        </>
    );
};

export default MainChat;
