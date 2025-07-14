const express = require("express");
const router = express.Router();
const {
  getProperties,
  getOneProperty,
  createProperty,
} = require("../controllers/listingController");
const verifyToken = require("../middleware/verify-token");

router.get("/", getProperties);
router.post("/:userId", verifyToken, createProperty);
router.put("/:userId/:listingId", verifyToken, createProperty);
router.get("/:listingId", getOneProperty);

router.get("/:listingId/edit", (req, res) => res.send("Edit 1 property"));

module.exports = router;
