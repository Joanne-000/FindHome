const express = require("express");
const router = express.Router();
const { getUser } = require("../controllers/userController");
const verifyToken = require("../middleware/verify-token");

router.get("/:userId", verifyToken, getUser);
router.put("/edit", (req, res) => res.send("Edit User profile"));

module.exports = router;
