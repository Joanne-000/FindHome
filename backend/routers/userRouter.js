const express = require("express");
const router = express.Router();
const { getUser, updateUser } = require("../controllers/userController");
const verifyToken = require("../middleware/verify-token");

router.get("/:userId", verifyToken, getUser);
router.put("/:userId/edit", verifyToken, updateUser);

module.exports = router;
