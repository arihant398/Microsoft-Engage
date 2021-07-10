import React, { useContext, useRef, useEffect } from "react";
import { Button } from "@material-ui/core";
import { SocketContext } from "../SocketContext";

const Notifications = () => {
    const {
        answerCall,
        call,
        callAccepted,
        isWaitingRoom,
        isAdmin,
        isInMeetingRoom,
    } = useContext(SocketContext);
    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            console.log(
                call.isReceivedCall,
                " ",
                callAccepted,
                " ",
                isWaitingRoom
            );
            if (call.isReceivedCall && !isWaitingRoom) {
                answerCall();
            }
        }
    }, [call.isReceivedCall]);

    return (
        <div className="notification">
            {call.isReceivedCall && isWaitingRoom && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p
                        style={{
                            fontSize: "25px",
                            color: "white",
                            fontWeight: "500",
                            margin: "0",
                        }}
                    >
                        {call.name} is in Waiting Room
                    </p>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={answerCall}
                        style={{ marginLeft: "8px" }}
                    >
                        Let Them In
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Notifications;
