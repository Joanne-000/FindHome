const express = require("express");
require("dotenv").config();
const { pool } = require("../index");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createPayload,
  emailInAgents,
  emailInBuyers,
} = require("../middleware/utils");
const {
  dataValidation,
  signinValidation,
} = require("../middleware/utils-validation");
const { userSignUp } = require("../controllers/signUp");

const signUp = async (req, res) => {
  const client = await pool.connect();

  console.log("start in signup");
  try {
    await client.query("BEGIN");
    dataValidation(req);

    const emailInAgentsDB = await emailInAgents(client, req.body.email);
    const emailInBuyersDB = await emailInBuyers(client, req.body.email);
    if (emailInAgentsDB || emailInBuyersDB) {
      throw new Error("This Email has already been taken.");
    }
    if (req.body.password !== req.body.passwordconf) {
      throw new Error(
        "Password and Confirm Password are not the same. Please re-type."
      );
    }

    const user = await userSignUp(client, req, res);
    const payload = createPayload(user);
    const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    await client.query("COMMIT");
    res.status(201).json({ token });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error in signUp:", err.message);
    res.status(500).json({ err: err.message });
  } finally {
    client.release();
  }
};

const signIn = async (req, res) => {
  const client = await pool.connect();

  console.log("start in signin");

  try {
    const { email, password } = req.body;
    console.log("start in try");
    await client.query("BEGIN");
    signinValidation(req);

    const emailInAgentsDB = await emailInAgents(client, email);
    const emailInBuyersDB = await emailInBuyers(client, email);
    if (!emailInAgentsDB && !emailInBuyersDB) {
      throw new Error("Email address not found.");
    }

    const userInDB = emailInAgentsDB || emailInBuyersDB;
    const user = userInDB.rows[0] || userInDB.rows[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.hashedpw);

    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials.");
    }

    const payload = createPayload(user);

    const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });
    await client.query("COMMIT");
    res.status(200).json({ token });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ err: err.message });
  } finally {
    client.release();
  }
};

module.exports = { signUp, signIn };
