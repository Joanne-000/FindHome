const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controllers/authController");

router.get("/", (req, res) => res.send("home page"));
router.post("/signup", signUp);
router.post("/signin", signIn);

module.exports = router;
