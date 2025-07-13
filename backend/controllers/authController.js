const express = require("express");
require("dotenv").config();
const pg = require("pg");
const { Pool } = pg;
const connection = process.env.PGCONNECT;
const pool = new Pool({ connectionString: connection });

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createPayload } = require("../middleware/utils");

const saltRounds = 12;

const userSignUp = async (client, req, res) => {
  console.log("start in function");
  const {
    email,
    password,
    passwordConf,
    displayName,
    contactNumber,
    userRole,
    licenseId,
    profilePhoto,
    isActive,
    preferContactMethod,
    preferLocation,
    preferBudget,
    preferRooms,
  } = req.body;

  const role = req.body.userRole + "s";
  console.log("req.body", req.body);
  let user;
  console.log("email", email);
  const emailInDatabase = await client.query(
    `select * from ${role} where email = $1`,
    [email]
  );
  console.log("emailInDatabase", emailInDatabase.rows[0]);
  if (emailInDatabase.rows[0]) {
    return res.status(409).send({ err: "This Email has already been taken." });
  }

  const hashedPW = bcrypt.hash(password, saltRounds);
  if (role === "agents") {
    const agentText = `insert into ${role} (email, password, displayname, contactNumber, userRole, licenseId, profilePhoto, isActive) values ($1,$2,$3,$4,$5,$6,$7,$8) returning id`;
    const agentValue = [
      email,
      hashedPW,
      displayName,
      contactNumber,
      userRole,
      licenseId,
      profilePhoto,
      isActive,
    ];

    const result = await client.query(agentText, agentValue);
    const agentId = result.rows[0];
    const selectUser = await client.query(
      `select * from ${role} where id = $1`,
      [agentId.id]
    );

    user = selectUser.rows[0];
  } else {
    const buyerText = `insert into ${role} (email, password, displayName, contactNumber, userRole, preferContactMethod, preferLocation,preferBudget,preferRooms, isActive) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning id`;
    const buyerValue = [
      email,
      password,
      displayName,
      contactNumber,
      userRole,
      preferContactMethod,
      preferLocation,
      preferBudget,
      preferRooms,
      isActive,
    ];
    const result = await client.query(buyerText, buyerValue);
    const buyerId = result.rows[0];

    const selectUser = await client.query(
      `select * from ${role} where id = $1`,
      [buyerId.id]
    );
    user = selectUser.rows[0];
  }
  return user;
};

const signUp = async (req, res) => {
  const client = await pool.connect();
  console.log("start in signup");

  try {
    try {
      console.log("start in try");

      await client.query("BEGIN");
      const user = await userSignUp(client, req, res);
      const payload = createPayload(user);

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
    res.status(500).json({ err: "Something went wrong." });
  }
};

// const signIn = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(404).json({ err: "Email address not found." });
//     }

//     const isPasswordCorrect = bcrypt.compareSync(
//       req.body.password,
//       user.hashedPassword
//     );
//     if (!isPasswordCorrect) {
//       return res.status(401).json({ err: "Invalid credentials." });
//     }
//     //to save the req.user as user
//     const payload = createPayload(user);

//     const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
//       expiresIn: "1hr",
//     });

//     res.status(200).json({ token });
//   } catch (err) {
//     res.status(500).json({ err: err.message });
//   }
// };

module.exports = { signUp };
