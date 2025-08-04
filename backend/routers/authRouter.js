const verifyToken = require("../middleware/verify-token");
const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controllers/authController");
const {
  getTop5Properties,
  getTop5FavProperties,
} = require("../controllers/showListings");
const { checkout } = require("../controllers/checkout");

router.get("/getTop5Properties", getTop5Properties);
router.get("/getTop5FavProperties", getTop5FavProperties);

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/:userId/create-checkout-session", verifyToken, checkout);
module.exports = router;
