const { loadUser } = require("../middleware/utils");
const { editUser, delUser } = require("../middleware/utils-editUser");
const express = require("express");
require("dotenv").config();
const pg = require("pg");
const { Pool } = pg;
const connection = process.env.PGCONNECT;
const pool = new Pool({ connectionString: connection });

const getProperties = async (req, res) => {
  const client = await pool.connect();

  try {
    try {
      console.log("start in try");
      await client.query("BEGIN");
      const result = await client.query(`select * from properties`);

      const properties = result.rows;

      res.status(200).json(properties);

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

const getOneProperty = async (req, res) => {
  const client = await pool.connect();
  const listingId = Number(req.params.listingId);

  try {
    try {
      console.log("start in try");
      await client.query("BEGIN");

      const text = `select * from properties where id = $1`;
      const value = [listingId];
      const result = await client.query(text, value);

      const properties = result.rows;

      res.status(200).json(properties);

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

const updateUser = async (req, res) => {
  const client = await pool.connect();

  try {
    const currentUser = loadUser(req);
    const userId = Number(req.params.userId);

    if (currentUser.id !== userId) {
      res.status(403).send("Unauthorized User");
    }

    try {
      console.log("start in try");

      await client.query("BEGIN");

      const user = await editUser(client, req, res);

      res.status(200).json(user);

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

// const destroyUser = async (req, res) => {
//   const client = await pool.connect();

//   try {
//     const currentUser = loadUser(req);
//     const userId = Number(req.params.userId);

//     if (currentUser.id !== userId) {
//       res.status(403).send("Unauthorized User");
//     }

//     try {
//       console.log("start in try");

//       await client.query("BEGIN");

//       const user = await delUser(client, req, res);

//       res.status(200).json(user);

//       await client.query("COMMIT");
//       client.release();
//     } catch (error) {
//       await client.query("ROLLBACK");
//       throw error;
//     }
//   } catch (err) {
//     res.status(500).json({ err: err.message });
//   }
// };

module.exports = { getProperties, getOneProperty };
