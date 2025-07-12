const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("home page"));
router.post("/signup", (req, res) => res.send("sign up"));
router.post("/signin", (req, res) => res.send("sign in"));

module.exports = router;
