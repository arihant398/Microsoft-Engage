import React from "react";
import App from "./App";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

const Test = () => {
    return (
        <Router>
            <h2>
                <Link to="/test">TEST</Link>
            </h2>
            <Route path="/test" component={App} />
        </Router>
    );
};

export default Test;
