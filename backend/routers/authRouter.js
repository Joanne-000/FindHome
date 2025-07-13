const express = require("express");
const router = express.Router();
const { signUp } = require("../controllers/authController");

router.get("/", (req, res) => res.send("home page"));
router.post("/signup", signUp);
router.post("/signin", (req, res) => res.send("sign in"));

module.exports = router;
