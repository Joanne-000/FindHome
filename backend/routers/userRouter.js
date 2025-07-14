const express = require("express");
const router = express.Router();
const {
  getUser,
  updateUser,
  destroyUser,
} = require("../controllers/userController");
const verifyToken = require("../middleware/verify-token");

router.get("/:userId", verifyToken, getUser);
router.put("/:userId/edit", verifyToken, updateUser);
router.put("/:userId/edit/del", verifyToken, destroyUser);

module.exports = router;
