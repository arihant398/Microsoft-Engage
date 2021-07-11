import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Button, TextField, Card } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import logo from "../images/final-logo.png";

// Component which handles registration of new users
const Register = () => {
    // Variables to store user entered data from the forms
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [password_confirmation, setconfirmPassword] = useState();
    const [error, setError] = useState();
    const [isError, setIsError] = useState(false);

    const history = useHistory();

    // On form submit, the form data is posted to server
    // Server verifies the data
    // If there are errors while verifying, the user is notified
    // Else the user is registered and taken to login screen
    const submit = async (e) => {
        e.preventDefault();
        try {
            const signup = { name, email, password, password_confirmation };
            const signupResponse = await axios.post(
                "https://union-server-final.herokuapp.com/api/signup",
                signup
            );
            history.push("/");
        } catch (err) {
            setError(err.response.data.errors);
            setIsError(true);
        }
    };
    return (
        <div className="Register">
            <div className="homeScreenLogo">
                <img
                    src={logo}
                    alt="UnIon"
                    width="200px"
                    style={{ margin: "20px" }}
                />
            </div>
            <Card>
                <div className="register-form">
                    <form onSubmit={submit}>
                        <div className="form-items">
                            <TextField
                                type="text"
                                id="standard-basic"
                                onChange={(e) => setName(e.target.value)}
                                label="Name"
                            />
                        </div>
                        <div className="form-items">
                            <TextField
                                type="email"
                                id="standard-basic"
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
                            <TextField
                                type="password"
                                id="standard-basic"
                                onChange={(e) =>
                                    setconfirmPassword(e.target.value)
                                }
                                label="Confirm Password"
                            />
                        </div>
                        <div className="form-items">
                            <Button
                                onClick={submit}
                                variant="contained"
                                color="primary"
                                style={{ width: "100px", marginTop: "15px" }}
                            >
                                Register
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
            <div className="errorAlert" style={{ margin: "10px" }}>
                {isError ? (
                    <div>
                        {error.map((err) => {
                            return (
                                <>
                                    <Alert
                                        severity="error"
                                        style={{ margin: "3px" }}
                                    >
                                        {Object.values(err)}
                                    </Alert>
                                </>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Register;
