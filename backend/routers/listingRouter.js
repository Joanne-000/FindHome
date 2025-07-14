const express = require("express");
const router = express.Router();
const {
  getProperties,
  getOneProperty,
} = require("../controllers/listingController");
router.get("/", getProperties);
router.get("/:listingId", getOneProperty);
router.get("/:listingId/edit", (req, res) => res.send("Edit 1 property"));

module.exports = router;
