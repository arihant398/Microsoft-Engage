import React, { useRef, useEffect, useContext, useState } from "react";
import { SocketContext } from "../SocketContext";

// Component which handles the video of all the participant, new component is created for each new user
const Video = (props) => {
    // SocketContext is used to communicated with the server
    const { handRaisedList, users, usersInMeeting, socketIdToDelete } =
        useContext(SocketContext);

    // Ref of participant video
    const ref = useRef();
    // Setting the source of the participant video to its stream
    useEffect(() => {
        props.peer.on("stream", (stream) => {
            ref.current.srcObject = stream;
        });
    }, []);

    // Styling to handle different number of users
    const rID = window.location.pathname.slice(1);
    const peerID = props.id;
    const [newClassName, setNewClassName] = useState("userVideo");
    const [userVideoNumber, setUserVideoNumber] = useState("78%");
    const [socketDelete, setSocketDelete] = useState();

    useEffect(() => {
        if (usersInMeeting[rID].length === 3) {
            setUserVideoNumber("47%");
        } else if (
            usersInMeeting[rID].length == 4 ||
            usersInMeeting[rID].length == 5
        ) {
            setUserVideoNumber("38%");
        } else {
            const videoSize = 160 / usersInMeeting[rID].length - 1;
            const videoSizeString = videoSize + "%";
            setUserVideoNumber(videoSizeString);
        }
    }, [usersInMeeting]);

    // Updates whether a user has raised their hand or not
    useEffect(() => {
        if (handRaisedList.length === 0) {
            setNewClassName("userVideo");
        }
        for (var i = 0; i < handRaisedList.length; i++) {
            if (handRaisedList[i].socketID === peerID) {
                setNewClassName("userVideo handRaisedBorder");
                break;
            } else {
                setNewClassName("userVideo");
            }
        }
    }, [handRaisedList]);
    return (
        <>
            {props.id !== socketIdToDelete ? (
                <>
                    {console.log(props.id + " Test " + socketIdToDelete)}
                    <video
                        playsInline
                        autoPlay
                        ref={ref}
                        className={newClassName}
                        style={{ width: userVideoNumber }}
                        controls
                        disablePictureInPicture
                    />
                </>
            ) : null}
        </>
    );
};

export default Video;
