import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import { v4 as uuidv4 } from "uuid";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { v4 as uuid } from "uuid";
import VideoChatScreen from "./components/VideoChatScreen";
import HomeScreen from "./components/HomeScreen";
import { UserContextProvider } from "./UserContext";
import Login from "./components/Login";
import Register from "./components/Register";
import UserScreen from "./components/UserScreen";
import ChatScreen from "./components/ChatScreen";

const App = () => {
    const [userData, setUserData] = useState({
        token: undefined,
        user: {},
    });
    return (
        <Router>
            <UserContextProvider>
                <Switch>
                    <Route path="/" exact component={HomeScreen} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/userLoggedIn" component={UserScreen} />
                    <Route
                        path="/chat/:id"
                        render={(props) => <ChatScreen {...props} />}
                    />
                    <Route
                        path="/:roomID"
                        render={(props) => (
                            <VideoChatScreen {...props} isOnlyChat={false} />
                        )}
                    />
                </Switch>
            </UserContextProvider>
        </Router>
    );
};

export default App;
