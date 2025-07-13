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
    const emailInAgentsDB = emailInAgents(client, req.body.email);
    const emailInBuyersDB = emailInBuyers(client, req.body.emalil);

    if (emailInAgentsDB || emailInBuyersDB) {
      return res
        .status(409)
        .send({ err: "This Email has already been taken." });
    }
    if (req.body.password !== req.body.passwordConf) {
      return res.status(409).send({
        err: "Password and Confirm Password are not the same. Please re-type.",
      });
    }

    try {
      console.log("start in try");

      await client.query("BEGIN");

      const user = await userSignUp(client, req, res);
      const payload = createPayload(user);
      saveUser(user);
      const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });

      res.status(201).json({ token });

      await client.query("COMMIT");
      client.release();
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const signIn = async (req, res) => {
  try {
    const client = await pool.connect();

    const emailInAgentsDB = emailInAgents(client, req.body.email);
    const emailInBuyersDB = emailInBuyers(client, req.body.emalil);

    if (!emailInAgentsDB || !emailInBuyersDB) {
      return res.status(404).send({ err: "Email address not found." });
    }
    try {
      console.log("start in try");
      console.log(req.body);

      await client.query("BEGIN");

      const { email, password, userrole } = req.body;
      const role = userrole + "s";
      const selectUser = await client.query(
        `select * from ${role} where email = $1`,
        [email]
      );
      console.log(selectUser.rows[0]);

      const user = selectUser.rows[0];
      console.log(password);
      console.log(user.hashedpw);

      const isPasswordCorrect = await bcrypt.compare(password, user.hashedpw);

      if (!isPasswordCorrect) {
        return res.status(401).json({ err: "Invalid credentials." });
      }

      const payload = createPayload(user);
      const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });

      res.status(200).json({ token });

      await client.query("COMMIT");
      client.release();
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = { signUp, signIn };
