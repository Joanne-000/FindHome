const express = require("express");
const router = express.Router();
const {
  createListing,
  updateListing,
  destroyListing,
} = require("../controllers/listingController");
const {
  getProperties,
  getOneProperty,
} = require("../controllers/showListingsController");
const verifyToken = require("../middleware/verify-token");

router.get("/", getProperties);
router.post("/:userId/new", verifyToken, createListing);
router.put("/:userId/:listingId/edit", verifyToken, updateListing);

router.put("/:userId/:listingId/del", verifyToken, destroyListing);
router.get("/:listingId", getOneProperty);

module.exports = router;
