const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controllers/authController");
const { getTop5Properties } = require("../controllers/showListings");

router.get("/", getTop5Properties);
router.post("/signup", signUp);
router.post("/signin", signIn);

module.exports = router;
