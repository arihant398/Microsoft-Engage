import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Button, TextField } from "@material-ui/core";

const Register = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [password_confirmation, setconfirmPassword] = useState();
    const [error, setError] = useState();

    const serverURL = "http://localhost:5000/api/signup";

    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const signup = { name, email, password, password_confirmation };
            const signupResponse = await axios.post(
                "http://localhost:5000/api/signup",
                signup
            );
            console.log(signupResponse.data);
            history.push("/");
        } catch (err) {
            //err.response.data.msg && setError(err.response.data.msg);
            console.log("Error while Signing Up");
        }
    };
    return (
        <div className="Register">
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
                        onChange={(e) => setconfirmPassword(e.target.value)}
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
    );
};

export default Register;
