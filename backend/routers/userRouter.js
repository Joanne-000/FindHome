const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("Display User profile"));
router.put("/edit", (req, res) => res.send("Edit User profile"));

module.exports = router;
