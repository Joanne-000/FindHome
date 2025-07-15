const express = require("express");
const router = express.Router();
const {
  getProperties,
  getOneProperty,
  createListing,
  updateListing,
  destroyListing,
} = require("../controllers/listingController");
const verifyToken = require("../middleware/verify-token");

router.get("/", getProperties);
router.post("/:userId", verifyToken, createListing);
router.put("/:userId/:listingId/edit", verifyToken, updateListing);
router.put("/:userId/:listingId/del", verifyToken, destroyListing);
router.get("/:listingId", getOneProperty);

module.exports = router;
