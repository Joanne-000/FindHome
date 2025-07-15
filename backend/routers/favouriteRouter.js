const express = require("express");
const router = express.Router();
const {
  getFavourites,
  createFavourite,
} = require("../controllers/favouriteController");
const verifyToken = require("../middleware/verify-token");

router.get("/:userId", verifyToken, getFavourites);
router.post("/:userId/:listingId", verifyToken, createFavourite);

module.exports = router;
