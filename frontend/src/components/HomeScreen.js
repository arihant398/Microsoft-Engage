import React, { useEffect, useState } from "react";
import { Typography, AppBar, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, Link } from "react-router-dom";
import { v1 as uuid } from "uuid";

// Material-UI styling to give margin to required items
const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));

// Component which acts as the main home screen.
// Checks wheter user is logged in or not.
// Redirects accordingly.
const HomeScreen = (props) => {
    const classes = useStyles();

    // Creates a new room
    function create() {
        const id = uuid();
        props.history.push(`/${id}`);
    }

    const hist = useHistory();

    // Redirect function to register and login pages
    const register = () => hist.push("/register");
    const login = () => hist.push("/login");

    // Checking log in status
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const loggedInUser = localStorage.getItem("user-name");
        if (loggedInUser) {
            setIsLoggedIn(true);
        } else {
            login();
        }
    }, []);

    return (
        <div>
            {!isLoggedIn ? (
                <div className={`${classes.root} homeScreen`}>
                    <div>
                        <Button
                            onClick={register}
                            variant="contained"
                            color="primary"
                            style={{ width: "100px" }}
                        >
                            Register
                        </Button>
                    </div>
                    <div>
                        <Button
                            onClick={login}
                            variant="contained"
                            color="primary"
                            style={{ width: "100px" }}
                        >
                            Login
                        </Button>
                    </div>
                    <div>
                        <Button
                            onClick={create}
                            variant="contained"
                            color="primary"
                            style={{ width: "100px" }}
                        >
                            Guest
                        </Button>
                    </div>
                </div>
            ) : (
                hist.push("/userLoggedIn")
            )}
        </div>
    );
};

export default HomeScreen;
