const { loadUserFromToken, createPayload } = require("../middleware/utils");
const { dataValidation } = require("../middleware/utils-validation");
const { editUser, delUser } = require("./editUser");
const validator = require("validator");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const { pool } = require("../index");

const getUser = async (req, res) => {
  try {
    const currentUser = loadUserFromToken(req);
    const userId = req.params.userId;
    if (currentUser.id !== userId) {
      throw new Error("Unauthorized User");
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
    const userId = req.params.userId;
    if (currentUser.id !== userId) {
      throw new Error("Unauthorized User");
    }

    const user = await editUser(pool, req, res, currentUser);
    const payload = createPayload(user);

    const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const destroyUser = async (req, res) => {
  console.log(req.body);
  try {
    const currentUser = loadUserFromToken(req);
    const userId = req.params.userId;
    if (currentUser.id !== userId) {
      res.status(403).send("Unauthorized User");
    }

    await delUser(pool, req, res, currentUser);

    res.status(200).send("Account deleted");
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = { getUser, updateUser, destroyUser };
