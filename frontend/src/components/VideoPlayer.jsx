import React, { useContext, useEffect, useState } from "react";
import { Button, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SocketContext } from "../SocketContext";
import { UserContext } from "../UserContext";
import axios from "axios";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { Row, Col } from "react-bootstrap";
import Chat from "./Chat";

import {
    Mic,
    MicOff,
    Videocam,
    VideocamOff,
    PanTool,
    ScreenShare,
    StopScreenShare,
    Send,
    AddCircle,
    MeetingRoom,
    NoMeetingRoom,
    MicNone,
} from "@material-ui/icons";
import Video from "./Video";

// Material-UI styles
const useStyles = makeStyles((theme) => ({
    video: {
        width: "550px",
        [theme.breakpoints.down("xs")]: {
            width: "300px",
        },
    },
    gridContainer: {
        justifyContent: "center",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
        },
    },
    paper: {
        padding: "10px",
        border: "2px solid black",
        margin: "10px",
    },
    buttons: {
        flexDirection: "column",
    },
}));

// Component which acts as the main video chat screen
const VideoPlayer = ({ isOnlyChat }) => {
    // SocketContext is used to communicate with the server
    const {
        name,
        callAccepted,
        myVideo,
        userVideo,
        callEnded,
        stream,
        call,
        muteMic,
        muteCam,
        isMuted,
        isVideoOff,
        isInMeeting,
        shareScreen,
        stopShareScreen,
        isScreenShare,
        sendMessage,
        updateMessages,
        messages,
        roomID,
        isAdmin,
        callUser,
        users,
        setIsWaitingRoom,
        isWaitingRoom,
        peers,
        raiseHand,
        handRaisedList,
        peersRef,
        me,
        setHandRaisedList,
        putHandDown,
        setMessages,
    } = useContext(SocketContext);
    const classes = useStyles();

    // UserContext is used to use client side data
    const { userEmail, userRoomListData, setUserEmail, setUserName, userName } =
        useContext(UserContext);
    const [isRoomAdded, setIsRoomAdded] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const [isNewWaitingRoom, setIsNewWaitingRoom] = useState(false);

    // Update waiting room status
    const updateIsWaitingRoom = () => {
        setIsWaitingRoom(!isWaitingRoom);
    };

    // Handle screen share
    const handleScreenShare = () => {
        if (!isScreenShare) {
            shareScreen();
        } else {
            stopShareScreen();
        }
    };

    // Setting client side user data
    const rID = window.location.pathname.slice(1);
    setUserEmail(() => localStorage.getItem("user-email"));
    setUserName(() => localStorage.getItem("user-name"));

    // Updating waiting room status for the server
    useEffect(() => {
        Object.keys(userRoomListData).map((obj, i) => {
            if (userRoomListData[obj].id === rID) {
                setIsRoomAdded(true);
                setIsWaitingRoom(userRoomListData[obj].isWaitingRoom);
                return;
            }
        });
    }, []);

    // Updating Messages
    useEffect(() => {
        updateMessages();
        setMessageList(messages);
    }, [messages]);

    const [newMessage, setNewMessage] = useState("");
    const [messageList, setMessageList] = useState({});

    // Function to add new room to the users room database
    // Sends a post request to the server with the required data
    // Alerts the user of the status once the request is done
    const addNewRoom = async (e) => {
        e.preventDefault();
        try {
            const roomData = {
                email: userEmail,
                id: rID,
                isWaitingRoom: isWaitingRoom,
                roomName: "New Room",
            };
            const roomResponse = await axios.post(
                "https://union-server-final.herokuapp.com/api/addRoom",
                roomData
            );
            setIsRoomAdded(true);
        } catch (err) {}
    };

    //Raise Hand
    const [isHandRaised, setIsHandRaised] = useState(false);
    const handRaised = () => {
        if (!isHandRaised) {
            raiseHand();
        } else {
            putHandDown();
        }

        setIsHandRaised(!isHandRaised);
    };

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

    return (
        <div style={{ marginTop: "10px" }}>
            <Row style={{ margin: "3px" }}>
                {!isOnlyChat ? (
                    <Col
                        sm={12}
                        md={9}
                        lg={9}
                        xl={9}
                        style={{ paddingLeft: 0, paddingRight: 0 }}
                    >
                        <div className="grid-item item1">
                            {callAccepted ? (
                                <div className="myVideoContainerPlay">
                                    {stream && !callEnded && (
                                        <video
                                            playsInline
                                            muted
                                            ref={myVideo}
                                            autoPlay
                                            className="myVideo"
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="myVideoContainerSingle">
                                    {stream && !callEnded && (
                                        <video
                                            playsInline
                                            muted
                                            ref={myVideo}
                                            autoPlay
                                            className="myVideoSingle"
                                        />
                                    )}
                                </div>
                            )}
                            <div className="testVideoContainer">
                                <div className="userVideoContainer">
                                    {peers.map((peer, index) => {
                                        if (peer.peer.readable) {
                                            return (
                                                <Video
                                                    key={index}
                                                    peer={peer.peer}
                                                    id={peer.id}
                                                    handRaisedList={
                                                        handRaisedList
                                                    }
                                                />
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                    </Col>
                ) : null}

                <Col
                    sm={12}
                    md={!isOnlyChat ? 3 : 9}
                    lg={!isOnlyChat ? 3 : 9}
                    xl={!isOnlyChat ? 3 : 9}
                    style={{ paddingLeft: 0, paddingRight: 0 }}
                >
                    <Chat
                        messages={messages}
                        roomID={roomID}
                        listening={listening}
                        transcript={transcript}
                        setNewMessage={setNewMessage}
                        sendMessage={sendMessage}
                        listenToAudio={listenToAudio}
                        stopListeningToAudio={stopListeningToAudio}
                        newMessage={newMessage}
                        isOnlyChat={isOnlyChat}
                        userid={me}
                    ></Chat>
                </Col>
            </Row>
            {!isOnlyChat ? (
                <Row>
                    <Col sm={12} md={9} lg={9} xl={9}>
                        <div className="horizontal-center options-bar">
                            <Tooltip title={!isMuted ? "Mute" : "Unmute"}>
                                <Button
                                    color="primary"
                                    startIcon={
                                        !isMuted ? (
                                            <Mic
                                                style={{ fontSize: "35px" }}
                                                center
                                            />
                                        ) : (
                                            <MicOff
                                                style={{ fontSize: "35px" }}
                                            />
                                        )
                                    }
                                    onClick={muteMic}
                                    className="muteButtons"
                                ></Button>
                            </Tooltip>
                            <Tooltip
                                title={
                                    !isVideoOff ? "Stop Video" : "Start Video"
                                }
                            >
                                <Button
                                    color="primary"
                                    startIcon={
                                        !isVideoOff ? (
                                            <Videocam
                                                style={{ fontSize: "35px" }}
                                            />
                                        ) : (
                                            <VideocamOff
                                                style={{ fontSize: "35px" }}
                                            />
                                        )
                                    }
                                    onClick={muteCam}
                                    className="muteButtons"
                                ></Button>
                            </Tooltip>

                            {!isRoomAdded ? (
                                <Tooltip title={"Add Room"}>
                                    <Button
                                        color="primary"
                                        startIcon={
                                            <AddCircle
                                                style={{ fontSize: "35px" }}
                                            />
                                        }
                                        onClick={addNewRoom}
                                        className="muteButtons"
                                    ></Button>
                                </Tooltip>
                            ) : null}

                            {isAdmin ? (
                                <Tooltip
                                    title={
                                        !isWaitingRoom
                                            ? "Enable Waiting Room"
                                            : "Disable Waiting Room"
                                    }
                                >
                                    <Button
                                        color="primary"
                                        startIcon={
                                            isWaitingRoom ? (
                                                <MeetingRoom
                                                    style={{ fontSize: "35px" }}
                                                />
                                            ) : (
                                                <NoMeetingRoom
                                                    style={{ fontSize: "35px" }}
                                                />
                                            )
                                        }
                                        onClick={updateIsWaitingRoom}
                                        className="muteButtons"
                                    ></Button>
                                </Tooltip>
                            ) : null}

                            {isInMeeting ? (
                                <>
                                    {" "}
                                    <Tooltip
                                        title={
                                            !isScreenShare
                                                ? "Share Screen"
                                                : "Stop Screen Share"
                                        }
                                    >
                                        <Button
                                            color="primary"
                                            startIcon={
                                                !isScreenShare ? (
                                                    <ScreenShare
                                                        style={{
                                                            fontSize: "35px",
                                                        }}
                                                    />
                                                ) : (
                                                    <StopScreenShare
                                                        style={{
                                                            fontSize: "35px",
                                                        }}
                                                    />
                                                )
                                            }
                                            onClick={handleScreenShare}
                                            className="muteButtons"
                                        ></Button>
                                    </Tooltip>
                                    <Tooltip
                                        title={
                                            !isHandRaised
                                                ? "Raise Hand"
                                                : "Put Hand Down"
                                        }
                                    >
                                        <Button
                                            color="primary"
                                            startIcon={
                                                <PanTool
                                                    style={{ fontSize: "30px" }}
                                                />
                                            }
                                            onClick={handRaised}
                                            className="muteButtons"
                                        ></Button>
                                    </Tooltip>
                                </>
                            ) : null}
                        </div>
                    </Col>{" "}
                    <Col sm={12} md={3} lg={3} xl={3}></Col>
                </Row>
            ) : null}
        </div>
    );
};

function deleteFromArray(array, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].socketID === value) {
        }
    }
}

export default VideoPlayer;
