const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("Display all properties"));
router.get("/:listingId", (req, res) => res.send("Display 1 property"));
router.get("/:listingId/edit", (req, res) => res.send("Edit 1 property"));

module.exports = router;
