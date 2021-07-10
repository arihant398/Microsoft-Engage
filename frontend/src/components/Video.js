import React, { useRef, useEffect, useContext, useState } from "react";
import { SocketContext } from "../SocketContext";

const Video = (props) => {
    const { handRaisedList, users, usersInMeeting, socketIdToDelete } =
        useContext(SocketContext);
    const ref = useRef();
    useEffect(() => {
        props.peer.on("stream", (stream) => {
            ref.current.srcObject = stream;
        });
    }, []);
    const rID = window.location.pathname.slice(1);
    const peerID = props.id;
    const [newClassName, setNewClassName] = useState("userVideo");
    const [userVideoNumber, setUserVideoNumber] = useState("78%");

    useEffect(() => {
        if (usersInMeeting[rID].length === 3) {
            setUserVideoNumber("47%");
        } else if (users[rID].length >= 4) {
            setUserVideoNumber("38%");
        }
    }, [usersInMeeting]);

    useEffect(() => {
        console.log("Test Inside video.js", handRaisedList);
        if (handRaisedList.length === 0) {
            setNewClassName("userVideo");
        }
        for (var i = 0; i < handRaisedList.length; i++) {
            console.log("PID", peerID);
            if (handRaisedList[i].socketID === peerID) {
                setNewClassName("userVideo handRaisedBorder");
                break;
            } else {
                setNewClassName("userVideo");
            }
        }
    }, [handRaisedList]);
    console.log("PID", peerID);
    return (
        <>
            {props.id !== socketIdToDelete ? (
                <video
                    playsInline
                    autoPlay
                    ref={ref}
                    className={newClassName}
                    style={{ width: userVideoNumber }}
                    controls
                    disablePictureInPicture
                />
            ) : null}
        </>
    );
};

export default Video;
