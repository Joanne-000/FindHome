const express = require("express");
require("dotenv").config();
const pg = require("pg");
const { Pool } = pg;
const connection = process.env.PGCONNECT;
const pool = new Pool({ connectionString: connection });

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createPayload,
  emailInAgents,
  emailInBuyers,
  saveUser,
} = require("../middleware/utils");
const { userSignUp } = require("../middleware/utils-SignUp");

const signUp = async (req, res) => {
  const client = await pool.connect();
  console.log("start in signup");
  try {
    const emailInAgentsDB = await emailInAgents(client, req.body.email);
    const emailInBuyersDB = await emailInBuyers(client, req.body.email);
    if (emailInAgentsDB || emailInBuyersDB) {
      return res
        .status(409)
        .send({ err: "This Email has already been taken." });
    }
    if (req.body.password !== req.body.passwordconf) {
      return res.status(409).send({
        err: "Password and Confirm Password are not the same. Please re-type.",
      });
    }

    try {
      console.log("start in try");

      await client.query("BEGIN");
      const user = await userSignUp(client, req, res);
      const payload = createPayload(user);
      saveUser(req, payload);
      const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });

      res.status(201).json({ token });

      await client.query("COMMIT");
      client.release();
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const signIn = async (req, res) => {
  const client = await pool.connect();
  console.log("start in signup");
  try {
    const emailInAgentsDB = await emailInAgents(client, req.body.email);
    const emailInBuyersDB = await emailInBuyers(client, req.body.email);
    if (emailInAgentsDB && emailInBuyersDB) {
      return res.status(404).send({ err: "Email address not found." });
    }

    try {
      console.log("start in try");
      await client.query("BEGIN");

      const { email, password, userrole } = req.body;
      const role = userrole + "s";
      const text = `select * from ${role} where email = $1`;
      const value = [email];

      const result = await client.query(text, value);
      const user = result.rows[0];
      const isPasswordCorrect = await bcrypt.compare(password, user.hashedpw);

      if (!isPasswordCorrect) {
        return res.status(401).json({ err: "Invalid credentials." });
      }

      saveUser(req, user);
      const payload = createPayload(user);

      const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });

      res.status(200).json({ token });

      await client.query("COMMIT");
      client.release();
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = { signUp, signIn };
