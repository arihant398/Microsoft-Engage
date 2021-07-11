import React, { useContext, useState } from "react";
import { Button, AppBar, Toolbar, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Assignment, Phone, PhoneDisabled, Home } from "@material-ui/icons";
import { SocketContext } from "../SocketContext";
import { UserContext } from "../UserContext";
import logo from "../images/final-logo-nav.png";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
    },
    gridContainer: {
        width: "100%",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
        },
    },
    container: {
        width: "600px",
        margin: "35px 0",
        padding: 0,
        [theme.breakpoints.down("xs")]: {
            width: "80%",
        },
    },
    margin: {
        marginTop: 20,
    },
    padding: {
        padding: 20,
    },
    paper: {
        padding: "10px 20px",
        border: "2px solid black",
    },
}));

const Options = ({ children }) => {
    const {
        me,
        callAccepted,
        name,
        setName,
        leaveCall,
        callUser,
        callEnded,
        users,
        isAdmin,
        isWaitingRoom,
        answerCall,
        usersInMeeting,
        isInMeetingRoom,
    } = useContext(SocketContext);

    const { userName, setUserName } = useContext(UserContext);
    const [idToCall, setIdToCall] = useState("");
    const classes = useStyles();
    setUserName(() => localStorage.getItem("user-name"));
    setName(() => userName);

    const [isClickedOnce, setIsClickedOnce] = useState(false);

    const RID = window.location.pathname.slice(1);
    const callAllUsers = () => {
        setIsClickedOnce(true);
        for (var i = 0; i < users[RID].length; i++) {
            if (users[RID][i] !== me) {
                for (var j = 0; j < usersInMeeting[RID].length; j++) {
                    if (usersInMeeting[RID][j] === users[RID][i])
                        callUser(users[RID][i]);
                }
            }
        }
    };
    const iconColor = "#acb6fc";

    return (
        <div className="">
            <AppBar
                color="dark"
                position="static"
                style={{ height: "55px", background: "#616ac1" }}
            >
                <Toolbar
                    style={{
                        minHeight: "55px",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <img src={logo} alt="UnIon" width="110px" />
                    </div>
                    <div className="notificationButton">{children}</div>
                    <div className="buttonsAppBar">
                        <a href="/" target="_blank">
                            <Tooltip title="Home Page">
                                <Button
                                    color="secondary"
                                    startIcon={<Home fontSize="35px" />}
                                ></Button>
                            </Tooltip>
                        </a>

                        <div className="callButton">
                            {callAccepted && !callEnded ? (
                                <Tooltip title="End Meeting">
                                    <Button
                                        color="secondary"
                                        startIcon={
                                            <PhoneDisabled fontSize="35px" />
                                        }
                                        onClick={leaveCall}
                                    ></Button>
                                </Tooltip>
                            ) : !isAdmin && !isClickedOnce ? (
                                <Tooltip title="Join Meeting">
                                    <Button
                                        color="primary"
                                        startIcon={
                                            <Phone
                                                fontSize="35px"
                                                style={{ color: iconColor }}
                                            />
                                        }
                                        onClick={() => callAllUsers()}
                                    >
                                        {/* {isWaitingRoom ? "Request Entry" : "Join Call"} */}
                                    </Button>
                                </Tooltip>
                            ) : null}{" "}
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Options;
