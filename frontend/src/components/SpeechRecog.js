import React, { useContext, useState } from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { SocketContext } from "../SocketContext";
import { Button } from "@material-ui/core";
import { Mic, MicOff, MicNone } from "@material-ui/icons";
import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";

const appId = "6d8fa7d4-5b64-41b7-8f97-bae537f883e5";
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
//SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

// Component used to handle speech recognition
const SpeechRecog = ({ setNewMessage }) => {
    const { sendMessage, updateMessages, messages } = useContext(SocketContext);
    //const [newMessage, setNewMessage] = useState("");

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

    const sendMessageToUsers = () => {
        // sendMessage(newMessage);
        resetTranscript();
    };

    return (
        <>
            <Button
                color="primary"
                startIcon={<MicNone style={{ fontSize: "30px" }} />}
                onTouchStart={() => {
                    resetTranscript();
                    SpeechRecognition.startListening({
                        continuous: true,
                    });
                }}
                onMouseDown={() => {
                    resetTranscript();
                    SpeechRecognition.startListening({
                        continuous: true,
                    });
                }}
                onTouchEnd={stopListeningToAudio}
                onMouseUp={stopListeningToAudio}
                style={{ margin: "0px" }}
            ></Button>
            <div style={{ fontSize: "15px" }}>
                Microphone: {listening ? <b>on</b> : <b>off</b>}
            </div>
            <p style={{ fontSize: "15px" }}>Your Message: {transcript}</p>
        </>
    );
};
export default SpeechRecog;
