import React from "react";
import { Button } from "@material-ui/core";

// Component to handle some similar buttons
const Buttons = ({ text, method, size }) => {
    return (
        <span className="buttons">
            <Button
                onClick={method}
                variant="contained"
                color="primary"
                style={{ width: size, margin: "5px" }}
            >
                {text}
            </Button>
        </span>
    );
};

export default Buttons;
