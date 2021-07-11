import React, { useState } from "react";
import { Button, TextField, Tooltip } from "@material-ui/core";
import { AddCircle, MeetingRoom, NoMeetingRoom } from "@material-ui/icons";

// Component to Add New Room To the Database Specific to The User Logged In

const AddRoom = ({ setIsWaitingRoom, setRoomName, addRoom }) => {
    const [waitingRoom, setWaitingRoom] = useState(false);

    // Update Waiting Room Status
    const handleWaitingRoom = () => {
        setWaitingRoom(!waitingRoom);
        setIsWaitingRoom();
    };

    return (
        <div className="addNewRoom">
            <div className="test-align">
                <div className="roomTextField">
                    <TextField
                        id="standard-basic"
                        onChange={(e) => setRoomName(e.target.value)}
                        label="Room Name"
                        inputProps={{ style: { fontSize: 25 } }}
                        InputLabelProps={{ style: { fontSize: 25 } }}
                    />
                </div>
                <div className="roomButton">
                    <Tooltip
                        title={
                            !waitingRoom
                                ? "Enable Waiting Room"
                                : "Disable Waiting Room"
                        }
                    >
                        <Button
                            color="primary"
                            startIcon={
                                !waitingRoom ? (
                                    <MeetingRoom style={{ fontSize: "35px" }} />
                                ) : (
                                    <NoMeetingRoom
                                        style={{ fontSize: "35px" }}
                                    />
                                )
                            }
                            onClick={handleWaitingRoom}
                            style={{ margin: "5px" }}
                            className="addRoomButtons"
                        ></Button>
                    </Tooltip>
                    <Tooltip title="Add New Room">
                        <Button
                            color="primary"
                            startIcon={<AddCircle fontSize="50px" />}
                            onClick={addRoom}
                            style={{ margin: "5px" }}
                            className="addRoomButtons"
                        ></Button>
                    </Tooltip>{" "}
                </div>
            </div>
        </div>
    );
};

export default AddRoom;
