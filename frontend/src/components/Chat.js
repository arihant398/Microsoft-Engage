import React, { useContext, useState } from "react";
import { Button, TextField, Tooltip } from "@material-ui/core";
import { Send, MicNone, Home } from "@material-ui/icons";
import { Row, Col } from "react-bootstrap";
import { UserContext } from "../UserContext";

const Chat = ({
    messages,
    roomID,
    listening,
    transcript,
    setNewMessage,
    sendMessage,
    listenToAudio,
    stopListeningToAudio,
    newMessage,
    isOnlyChat,
    userid,
}) => {
    const mainChatClass = !isOnlyChat
        ? "grid-item item2 subGrid"
        : "grid-item item2-chat subGrid";

    const rID = !isOnlyChat
        ? window.location.pathname.slice(1)
        : window.location.pathname.slice(6);
    const colText = !isOnlyChat ? 8 : 9;
    const colButtons = !isOnlyChat ? 2 : 1;

    const [micColor, setMicColor] = useState("#3f50b5");

    const { userRoomListData } = useContext(UserContext);
    let roomName = "";
    Object.keys(userRoomListData).map((obj, i) => {
        if (userRoomListData[obj].id === rID) {
            roomName = userRoomListData[obj].roomName;
        }
    });

    return (
        <div className={mainChatClass}>
            <div className="subGrid-item subGrid-item1">
                <div className="chatMessage">
                    <div className="chatHeadingContainer">
                        {isOnlyChat ? (
                            <div className="chatHeading">{roomName}</div>
                        ) : null}
                    </div>

                    <div
                        className={
                            isOnlyChat ? "chatContainer" : "videoChatContainer"
                        }
                    >
                        {messages[rID] &&
                            Object.keys(messages[rID]).map((obj, i) => {
                                return (
                                    <Row>
                                        {console.log(
                                            messages[rID][obj].userID,
                                            " ",
                                            userid,
                                            " ",
                                            messages
                                        )}
                                        <div
                                            className={
                                                messages[rID][obj].userID ===
                                                userid
                                                    ? "userInnerChat"
                                                    : "innerChat"
                                            }
                                        >
                                            {messages[rID][obj].name !==
                                            null ? (
                                                <div>
                                                    <span
                                                        style={{
                                                            fontWeight: "900",
                                                            marginRight: "5px",
                                                            color: "black",
                                                        }}
                                                    >
                                                        {
                                                            messages[rID][obj]
                                                                .name
                                                        }
                                                        :{""}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span
                                                    style={{
                                                        fontWeight: "900",
                                                        marginRight: "5px",
                                                    }}
                                                >
                                                    Guest:
                                                </span>
                                            )}
                                            <div className={"messageText"}>
                                                {messages[rID][obj].message}
                                            </div>
                                        </div>
                                    </Row>
                                );
                            })}
                    </div>
                </div>
            </div>
            <div className="subGrid-item subGrid-item1">
                <div
                    style={{
                        fontSize: "15px",
                        textAlign: "left",
                        fontWeight: "700",
                        color: "black",
                    }}
                >
                    Microphone:{" "}
                    {listening ? (
                        <b>
                            <span style={{ color: "#3f51b5" }}>ON</span>
                        </b>
                    ) : (
                        <b>
                            <span style={{ color: "red" }}>OFF</span>
                        </b>
                    )}
                </div>
                <p
                    style={{
                        fontSize: "15px",
                        textAlign: "left",
                        fontWeight: "700",
                        color: "black",
                    }}
                >
                    Your Audio Message: {transcript}
                </p>
            </div>
            <div className="subGrid-item subGrid-item2">
                <div className="messageTypes">
                    <Row className="p-0 messageInputContainer">
                        <Col
                            sm={colText}
                            md={colText}
                            lg={colText}
                            xl={colText}
                        >
                            <TextField
                                label="Message"
                                value={newMessage}
                                fullWidth
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                        </Col>
                        <Col
                            sm={colButtons}
                            md={colButtons}
                            lg={colButtons}
                            xl={colButtons}
                            className="p-0"
                        >
                            <Tooltip title={"Send Message"}>
                                <Button
                                    color="primary"
                                    startIcon={
                                        <Send style={{ fontSize: "30px" }} />
                                    }
                                    onClick={() => {
                                        if (newMessage !== "") {
                                            sendMessage(newMessage);
                                            setNewMessage("");
                                        }
                                    }}
                                ></Button>
                            </Tooltip>
                        </Col>
                        <Col
                            sm={colButtons}
                            md={colButtons}
                            lg={colButtons}
                            xl={colButtons}
                            className="p-0"
                        >
                            <Tooltip title={"Convert Audio to Message"}>
                                <Button
                                    color="primary"
                                    startIcon={
                                        <MicNone
                                            style={{
                                                fontSize: "30px",
                                                color: micColor,
                                            }}
                                        />
                                    }
                                    onTouchStart={() => {
                                        setMicColor("#4caf50");
                                        listenToAudio();
                                    }}
                                    onMouseDown={() => {
                                        setMicColor("#4caf50");
                                        listenToAudio();
                                    }}
                                    onTouchEnd={() => {
                                        setMicColor("#3f50b5");
                                        stopListeningToAudio();
                                    }}
                                    onMouseUp={() => {
                                        setMicColor("#3f50b5");
                                        stopListeningToAudio();
                                    }}
                                    style={{ margin: "0px" }}
                                ></Button>
                            </Tooltip>
                        </Col>

                        {isOnlyChat ? (
                            <Col
                                sm={colButtons}
                                md={colButtons}
                                lg={colButtons}
                                xl={colButtons}
                            >
                                <a href="/">
                                    <Tooltip title={"Home Page"}>
                                        <Button
                                            color="secondary"
                                            startIcon={
                                                <Home
                                                    style={{ fontSize: "30px" }}
                                                />
                                            }
                                        ></Button>
                                    </Tooltip>
                                </a>
                            </Col>
                        ) : null}
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default Chat;
