import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useHistory } from "react-router-dom";
import {
    Button,
    TextField,
    Grid,
    AppBar,
    Toolbar,
    Tooltip,
} from "@material-ui/core";
import { ExitToApp, AddCircle, Chat, VideoCall } from "@material-ui/icons";
import { Row, Col } from "react-bootstrap";
import { v1 as uuid } from "uuid";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import AddRoom from "./AddRoom";
import RoomList from "./RoomList";
import Buttons from "./Buttons";
import logo from "../images/final-logo-nav.png";

const UserScreen = (props) => {
    const [name, setName] = useState();
    const [user, setUser] = useState({});
    const [alertStatus, setAlertStatus] = useState(0);
    const [newRoomID, setNewRoomID] = useState();

    const {
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        setUserRoomListData,
        userRoomListData,
    } = useContext(UserContext);
    const history = useHistory();

    function create() {
        const id = uuid();
        props.history.push(`/${id}`);
    }

    //Parameters for adding new room
    const [roomName, setRoomName] = useState("Room");
    const [isWaitingRoom, setIsWaitingRoom] = useState(false);
    const [isAddRoom, setIsAddRoom] = useState(false);

    function updateIsAddRoom() {
        setIsAddRoom(!isAddRoom);
        setIsViewRoom(false);
    }

    function updateIsWaitingRoom() {
        setIsWaitingRoom(!isWaitingRoom);
        console.log(isWaitingRoom);
    }

    //Parameters for viewing rooms
    const [isViewRoom, setIsViewRoom] = useState(false);
    const [roomListData, setRoomListData] = useState({});

    function updateIsViewRoom() {
        viewRooms();
        setIsViewRoom(!isViewRoom);
        setIsAddRoom(false);
    }

    const iconColor = "#acb6fc";

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user-name");
        if (loggedInUser) {
            const foundUser = JSON.parse(JSON.stringify(loggedInUser));
            setUserName(foundUser);
            setUserEmail(
                JSON.parse(JSON.stringify(localStorage.getItem("user-email")))
            );
        }
    }, []);

    const handleLogout = () => {
        setUserName();
        localStorage.clear();
        history.push("/");
    };

    const addNewRoom = async (e) => {
        e.preventDefault();
        const newId = uuid();
        console.log(isWaitingRoom);
        try {
            const roomData = {
                email: userEmail,
                id: newId,
                isWaitingRoom: isWaitingRoom,
                roomName: roomName,
            };
            console.log(roomData);
            const roomResponse = await axios.post(
                "http://localhost:5000/api/addRoom",
                roomData
            );
            setAlertStatus(1);
            console.log(roomResponse.data);
        } catch (err) {
            setAlertStatus(-1);
            console.log("Error while adding new Room");
        }
    };

    const viewRooms = async (e) => {
        e.preventDefault();
        try {
            const roomData = { email: userEmail };
            const roomResponse = await axios.post(
                "http://localhost:5000/api/viewRoom",
                roomData
            );
            console.log(userEmail);
            console.log(roomResponse.data);
            setRoomListData(roomResponse.data.result);
            setIsViewRoom(!isViewRoom);
            setUserRoomListData(roomResponse.data.result);
            localStorage.setItem(
                "user-room-data",
                JSON.stringify(roomResponse.data.result)
            );
            setIsAddRoom(false);
        } catch (err) {
            console.log("Error while Viewing  Room");
        }
    };

    return (
        <div className="userScreen-main">
            <AppBar
                position="static"
                style={{
                    height: "55px",
                    background: "#616ac1",
                    marginBottom: "20px",
                }}
            >
                <Toolbar
                    style={{
                        minHeight: "55px",
                    }}
                >
                    <Grid justify={"space-between"} container>
                        <Grid
                            xs={1}
                            item
                            className="logo"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                textAlign: "center",
                            }}
                        >
                            <img src={logo} alt="UnIon" width="110px" />
                        </Grid>
                        <Grid xs={4} item className="userScreen-Buttons">
                            <Tooltip title="Create New Room">
                                <Button
                                    color="primary"
                                    startIcon={
                                        <VideoCall
                                            fontSize="42px"
                                            style={{ color: iconColor }}
                                        />
                                    }
                                    onClick={create}
                                    className="videoCallButton"
                                ></Button>
                            </Tooltip>
                            <Tooltip title="Add New Room">
                                <Button
                                    color="primary"
                                    startIcon={
                                        <AddCircle
                                            fontSize="50px"
                                            style={{ color: iconColor }}
                                        />
                                    }
                                    onClick={updateIsAddRoom}
                                ></Button>
                            </Tooltip>
                            <Tooltip title="Chat">
                                <Button
                                    color="primary"
                                    startIcon={
                                        <Chat
                                            fontSize="50px"
                                            style={{ color: iconColor }}
                                        />
                                    }
                                    onClick={viewRooms}
                                ></Button>
                            </Tooltip>
                            <Tooltip title="LOGOUT">
                                <Button
                                    color="secondary"
                                    startIcon={
                                        <ExitToApp
                                            fontSize="50px"
                                            style={{ color: iconColor }}
                                        />
                                    }
                                    onClick={handleLogout}
                                ></Button>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={1} />
                    </Grid>
                </Toolbar>
            </AppBar>
            <div className="userScreen-Name">
                <p>Welcome {userName}</p>
            </div>

            <Grid container spacing={2} justify="center">
                {isViewRoom
                    ? Object.keys(roomListData).map((obj, i) => {
                          return (
                              <Grid key={roomListData[obj]._id} item>
                                  <RoomList
                                      roomListData={roomListData[obj]}
                                      setRoomID={setNewRoomID}
                                  />
                              </Grid>
                          );
                      })
                    : null}
            </Grid>

            {isAddRoom ? (
                <AddRoom
                    setIsWaitingRoom={updateIsWaitingRoom}
                    setRoomName={setRoomName}
                    addRoom={addNewRoom}
                />
            ) : null}

            {alertStatus === 1 ? (
                <Alert severity="success">New Room ID Added</Alert>
            ) : alertStatus === -1 ? (
                <Alert severity="error">
                    Failed To Add New Room ID, Please Try Agian
                </Alert>
            ) : null}
        </div>
    );
};

export default UserScreen;
