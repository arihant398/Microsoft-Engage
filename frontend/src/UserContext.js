import React, { createContext, useState } from "react";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [token, setToken] = useState(null);

    const [userRoomListData, setUserRoomListData] = useState([]);

    return (
        <UserContext.Provider
            value={{
                userName,
                setUserName,
                userEmail,
                setUserEmail,
                userPassword,
                setUserPassword,
                token,
                setToken,
                userRoomListData,
                setUserRoomListData,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export { UserContextProvider, UserContext };
