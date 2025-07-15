const express = require("express");
const router = express.Router();
const {
  getFavourites,
  createFavourite,
  destroyFavourite,
} = require("../controllers/favouriteController");
const verifyToken = require("../middleware/verify-token");

router.get("/:userId", verifyToken, getFavourites);
router.post("/:userId/:listingId", verifyToken, createFavourite);
router.post("/:userId/:listingId/del", verifyToken, destroyFavourite);

module.exports = router;
