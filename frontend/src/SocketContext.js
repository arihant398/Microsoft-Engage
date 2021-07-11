import React, {
    createContext,
    useState,
    useRef,
    useEffect,
    useContext,
} from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState(null);
    const [call, setCall] = useState({
        isReceivedCall: false,
        from: null,
        name: "",
        signal: null,
    });
    const [callAccepted, setCallAccepted] = useState(null);
    const [callEnded, setCallEnded] = useState(null);
    const [name, setName] = useState("");
    const [users, setUsers] = useState({});
    const [usersInMeeting, setUsersInMeeting] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isInMeeting, setIsInMeeting] = useState(false);
    const [isScreenShare, setIsScreenShare] = useState(false);
    const [isWaitingRoom, setIsWaitingRoom] = useState(false);
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [socketIdToDelete, setSocketIdToDelete] = useState();

    const roomID = window.location.pathname.slice(1);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const socket = useRef();

    //Messages
    const [messages, setMessages] = useState({});

    //Multiple Participants
    const peersRef = useRef([]);
    const [peers, setPeers] = useState([]);

    //HandRaised
    const [handRaisedList, setHandRaisedList] = useState([]);

    useEffect(() => {
        socket.current = io("http://localhost:5000/", {
            "sync disconnect on unload": true,
        });
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;
            })
            .catch((err) => {
                console.log("error while loading video", err);
            });

        socket.current.emit("join-room", roomID);

        socket.current.on("me", (id) => setMe(id));

        socket.current.on("allUsers", ({ users, usersInMeetingRoom }) => {
            setUsers(users);
            setUsersInMeeting(usersInMeetingRoom);
            if (users[roomID].length === 1) {
                setIsAdmin(true);
                setIsInMeeting(true);
            }
        });

        socket.current.on("handRaised", (socketID) => {
            setHandRaisedList((prevState) => [...prevState, socketID]);
        });

        socket.current.on("calluser", ({ from, name: callerName, signal }) => {
            setCall({
                isReceivedCall: true,
                from,
                name: callerName,
                signal,
            });
        });

        socket.current.on("updateMessage", (messages) => {
            setMessages(messages);
        });

        socket.current.on("messageReceived", (message) => {
            setMessages(message);
        });

        socket.current.on(
            "callaccepted",
            ({ signal, name, sockID, usersInMeetingRoom }) => {
                const item = peersRef.current.find((p) => p.peerID === sockID);
                setCallAccepted(true);
                item.peer.signal(signal);
                setIsInMeeting(true);
                setUsersInMeeting(usersInMeetingRoom);
                setCall({
                    isReceivedCall: false,
                    name,
                    signal,
                });
            }
        );

        socket.current.on(
            "callended",
            ({ socketID, users, usersInMeeting }) => {
                setUsers(users);
                setUsersInMeeting(usersInMeeting);
                setSocketIdToDelete(socketID);
            }
        );
    }, []);

    useEffect(() => {
        socket.current.on("handDown", (socketID) => {
            const newHandList = handRaisedList.filter(
                (ele) => ele.socketID !== socketID.socketID
            );
            setHandRaisedList(newHandList);
        });
    }, [handRaisedList]);

    function sendMessage(text) {
        socket.current.emit("messageSent", { text, name, id: me });
    }

    function updateMessages() {}

    function muteMic() {
        stream.getAudioTracks().forEach((track) => {
            track.enabled = !track.enabled;
            setIsMuted(!track.enabled);
        });
    }

    function muteCam() {
        stream.getVideoTracks().forEach((track) => {
            track.enabled = !track.enabled;
            setIsVideoOff(!track.enabled);
        });
    }

    //Raise Hand
    function raiseHand() {
        setIsHandRaised(true);
        socket.current.emit("hand-raised", { socketID: me });
    }
    function putHandDown() {
        setIsHandRaised(false);
        socket.current.emit("hand-down", { socketID: me });
    }

    const callAdmin = () => {
        callUser(users[roomID][0]);
    };

    const answerCall = () => {
        setCallAccepted(true);
        setCall({ isReceivedCall: false });
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on("signal", (data) => {
            socket.current.emit("answercall", {
                signal: data,
                to: call.from,
                name: name,
            });
        });
        peer.signal(call.signal);

        connectionRef.current = peer;
        setIsInMeeting(true);
        peersRef.current.push({
            peerID: call.from,
            peer,
        });
        setPeers((temp) => [...temp, { id: call.from, peer: peer }]);
    };

    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on("signal", (data) => {
            socket.current.emit("calluser", {
                userToCall: id,
                signalData: data,
                from: me,
                name,
            });
        });

        connectionRef.current = peer;
        peersRef.current.push({
            peerID: id,
            peer,
        });
        peers.push({ id: id, peer: peer });
    };

    const leaveCall = () => {
        setCallEnded(true);
        deleteID(users, me, roomID);
        deleteID(usersInMeeting, me, roomID);
        peers.map((peer) => {
            connectionRef.current = peer.peer;
            connectionRef.current.destroy();
        });
        setIsInMeeting(false);
        window.location.replace("/");
    };

    function shareScreen() {
        setIsScreenShare(true);
        navigator.mediaDevices
            .getDisplayMedia({ cursor: true })
            .then((screenStream) => {
                peers.map((peer) => {
                    connectionRef.current = peer.peer;

                    connectionRef.current.replaceTrack(
                        stream.getVideoTracks()[0],
                        screenStream.getVideoTracks()[0],
                        stream
                    );
                });

                myVideo.current.srcObject = screenStream;
                screenStream.getTracks()[0].onended = () => {
                    peers.map((peer) => {
                        connectionRef.current = peer.peer;
                        connectionRef.current.replaceTrack(
                            screenStream.getVideoTracks()[0],
                            stream.getVideoTracks()[0],
                            stream
                        );
                    });

                    myVideo.current.srcObject = stream;
                };
            });
    }

    function stopShareScreen() {
        setIsScreenShare(false);
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((screenStream) => {
                peers.map((peer) => {
                    connectionRef.current = peer.peer;
                    connectionRef.current.replaceTrack(
                        stream.getVideoTracks()[0],
                        screenStream.getVideoTracks()[0],
                        stream
                    );
                });

                myVideo.current.srcObject = screenStream;

                screenStream.getTracks()[0].onended = () => {
                    peers.map((peer) => {
                        connectionRef.current = peer.peer;
                        connectionRef.current.replaceTrack(
                            screenStream.getVideoTracks()[0],
                            stream.getVideoTracks()[0],
                            stream
                        );
                    });

                    myVideo.current.srcObject = stream;
                };
            });
    }

    return (
        <SocketContext.Provider
            value={{
                call,
                callAccepted,
                myVideo,
                userVideo,
                stream,
                name,
                setName,
                callEnded,
                me,
                callUser,
                leaveCall,
                answerCall,
                users,
                callAdmin,
                isAdmin,
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
                isWaitingRoom,
                setIsWaitingRoom,
                peers,
                usersInMeeting,
                raiseHand,
                handRaisedList,
                peersRef,
                setHandRaisedList,
                putHandDown,
                socketIdToDelete,
                setMessages,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

function deleteID(array, idToDelete, roomID) {
    for (var i = 0; i < array[roomID].length; i++) {
        if (array[roomID][i] === idToDelete) {
            array[roomID].splice(i, 1);
            return array;
        }
    }
    return array;
}

export { ContextProvider, SocketContext };
