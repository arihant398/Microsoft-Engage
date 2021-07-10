import React from "react";
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import axios from "axios";

const RoomList = ({ roomListData, setRoomID }) => {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const joinRoom = () => {
        history.push(`/${roomListData.id}`);
    };

    const viewMessages = async (e) => {
        e.preventDefault();
        try {
            const roomData = { roomID: roomListData.id };
            const roomResponse = await axios.post(
                "http://localhost:5000/api/viewMessages",
                roomData
            );
        } catch (err) {
            console.log("Error while Viewing  Room");
        }
    };
    return (
        <>
            <Card className={classes.root}>
                <div>
                    <CardContent>
                        <Typography
                            component="h5"
                            variant="h5"
                            style={{ fontWeight: "700" }}
                        >
                            {roomListData.roomName}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            <b>Waiting Room:</b>{" "}
                            {roomListData.isWaitingRoom
                                ? "Enabled"
                                : "Disabled"}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            <b>Room ID:</b> {roomListData.id}
                        </Typography>
                        <div className="roomNavButtons">
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ width: "100px", margin: "5px" }}
                                onClick={joinRoom}
                            >
                                Join
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ width: "100px", margin: "5px" }}
                                onClick={() => {
                                    setRoomID(roomListData.id);
                                    history.push(`/chat/${roomListData.id}`);
                                }}
                            >
                                Chat
                            </Button>
                        </div>
                    </CardContent>
                </div>
                <CardMedia
                    className={classes.cover}
                    image="/static/images/cards/live-from-space.jpg"
                    title="Live from space album cover"
                />
            </Card>
        </>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: "300px",
    },
}));

export default RoomList;
