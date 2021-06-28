const express = require("express");
const router = express.Router();
const { signup, signin, addRoom, viewRoom } = require("../controllers/auth");
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/addRoom", addRoom);
router.post("/viewRoom", viewRoom);
module.exports = router;
