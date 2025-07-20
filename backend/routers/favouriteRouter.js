const express = require("express");
const router = express.Router();
const {
  getFavourites,
  favourite,
  createFavourite,
  destroyFavourite,
} = require("../controllers/favouriteController");
const verifyToken = require("../middleware/verify-token");

router.get("/:userId", verifyToken, getFavourites);
router.put("/:userId/:listingId/fav", verifyToken, favourite);

// router.post("/:userId/:listingId", verifyToken, createFavourite);
// router.delete("/:userId/:favId/del", verifyToken, destroyFavourite);

module.exports = router;
