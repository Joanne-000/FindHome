const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("Display all enquiries"));

module.exports = router;
