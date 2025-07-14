const { loadUser } = require("../middleware/utils");
const express = require("express");
require("dotenv").config();
const pg = require("pg");
const { Pool } = pg;
const connection = process.env.PGCONNECT;
const pool = new Pool({ connectionString: connection });

const getUser = async (req, res) => {
  const client = await pool.connect();

  try {
    const currentUser = loadUser(req);
    const userId = Number(req.params.userId);
    const role = currentUser.userrole + "s";
    console.log("userId", userId);
    console.log("currentUser.id ", currentUser.id);

    if (currentUser.id !== userId) {
      res.status(403).send("Unauthorized User");
    }

    try {
      console.log("start in try");

      await client.query("BEGIN");
      console.log("role", role);

      const text = `select * from ${role} where id = $1`;
      const value = [userId];
      const result = await client.query(text, value);
      console.log("result", result);

      const user = result.rows[0];
      console.log("user", user);

      res.status(200).json(user);

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

module.exports = { getUser };
