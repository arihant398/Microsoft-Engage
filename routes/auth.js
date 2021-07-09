const express = require("express");
const router = express.Router();
const {
    signup,
    signin,
    addRoom,
    viewRoom,
    viewMessages,
} = require("../controllers/auth");
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/addRoom", addRoom);
router.post("/viewRoom", viewRoom);
router.post("/viewMessages", viewMessages);
module.exports = router;
