const { loadUserFromToken } = require("../middleware/utils");
const { dataValidation } = require("../middleware/utils-validation");
const { editUser, delUser } = require("./editUser");
const validator = require("validator");

require("dotenv").config();
const { pool } = require("../index");

const getUser = async (req, res) => {
  try {
    const currentUser = loadUserFromToken(req);
    const userId = Number(req.params.userId);
    if (currentUser.id !== userId) {
      res.status(403).send("Unauthorized User");
    }

    const role = currentUser.userrole + "s";
    const text = `select * from ${role} where id = $1`;
    const value = [userId];
    const result = await pool.query(text, value);
    const user = result.rows[0];
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    dataValidation(req, res);

    const currentUser = loadUserFromToken(req);
    const userId = Number(req.params.userId);
    if (currentUser.id !== userId) {
      res.status(403).send("Unauthorized User");
    }

    const user = await editUser(pool, req, res,currentUser);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const destroyUser = async (req, res) => {
  console.log(req.body)
  try {
    if (!req.body.email || !validator.isEmail(req.body.email)) {
        return res.status(400).json({ err: "A valid email is required" });
      }
      if (req.body.isactive !== "active" && req.body.isactive !== "deleted") {
      return res
        .status(400)
        .json({ err: "Status can only be active or deleted" });
    }

    const currentUser = loadUserFromToken(req);
    const userId = Number(req.params.userId);
    if (currentUser.id !== userId) {
      res.status(403).send("Unauthorized User");
    }

    const user = await delUser(pool, req, res,currentUser);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = { getUser, updateUser, destroyUser };
