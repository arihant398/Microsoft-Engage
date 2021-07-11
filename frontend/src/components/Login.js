import React, { useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import { v1 as uuid } from "uuid";
import {
    Button,
    TextField,
    Card,
    CardContent,
    CardMedia,
    Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import logo from "../images/final-logo.png";

const Login = (props) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const [isError, setIsError] = useState(false);

    const { setUserName, setUserEmail, setUserPassword, setToken } =
        useContext(UserContext);
    const history = useHistory();
    const serverURL = "https://rvc-5.herokuapp.com/";

    const submit = async (e) => {
        e.preventDefault();
        try {
            const loginUser = { email, password };
            const loginResponse = await axios.post(
                "http://localhost:5000/api/signin",
                loginUser
            );
            console.log(loginResponse.data.message);
            setUserName(loginResponse.data.message.name);
            setUserEmail(loginResponse.data.message.email);
            setUserPassword(loginResponse.data.message.password);
            setToken(loginResponse.data.token);
            localStorage.setItem("auth-token", loginResponse.data.token);
            localStorage.setItem("user-name", loginResponse.data.message.name);
            localStorage.setItem(
                "user-email",
                loginResponse.data.message.email
            );
            localStorage.setItem(
                "user-password",
                loginResponse.data.message.password
            );
            history.push("/userLoggedIn");
        } catch (err) {
            //err.response.data.msg && setError(err.response.data.msg);
            console.log("Error while logging in");
            console.log(err.response.data.errors[0]);
            setError(err.response.data.errors[0]);
            setIsError(true);
        }
    };

    function create() {
        const id = uuid();
        props.history.push(`/${id}`);
    }
    return (
        <div className="login">
            <div className="homeScreenLogo">
                <img
                    src={logo}
                    alt="UnIon"
                    width="200px"
                    style={{ margin: "20px" }}
                />
            </div>
            <Card>
                <div className="login-form">
                    <form onSubmit={submit}>
                        <div className="form-items">
                            <TextField
                                id="standard-basic"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email"
                            />
                        </div>
                        <div className="form-items">
                            <TextField
                                type="password"
                                id="standard-basic"
                                onChange={(e) => setPassword(e.target.value)}
                                label="Password"
                            />
                        </div>
                        <div className="form-items">
                            <div>
                                <Button
                                    onClick={submit}
                                    variant="contained"
                                    color="primary"
                                    style={{ width: "200px", margin: "5px" }}
                                >
                                    Login
                                </Button>
                            </div>
                        </div>
                        <div>
                            <Button
                                onClick={create}
                                variant="contained"
                                color="primary"
                                style={{ width: "200px", margin: "5px" }}
                            >
                                Continue As Guest
                            </Button>
                        </div>
                        <div style={{ marginTop: "2px" }}>
                            New User? <Link to="/register">Register</Link>
                        </div>
                    </form>
                </div>
            </Card>
            <div className="errorAlert" style={{ margin: "10px" }}>
                {isError ? (
                    <Alert severity="error">Invalid Login Details</Alert>
                ) : null}
            </div>
        </div>
    );
};

export default Login;
