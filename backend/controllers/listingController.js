const { loadUser } = require("../middleware/utils");
const { addListing } = require("../middleware/utils-addListing");
const { addImages } = require("../middleware/utils-addImages");

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
      const listingsResult = await client.query(`select * from listings`);

      const listings = listingsResult.rows;

      res.status(200).json(listings);

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

      const text = `select * from listings where id = $1`;
      const value = [listingId];
      const listingResult = await client.query(text, value);
      const listing = listingResult.rows;

      const imagesResult = await client.query(
        `select * from images where listing_id = $1`,
        [listingId]
      );
      const images = imagesResult.rows;

      res.status(200).json({ listing, images });

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

const createListing = async (req, res) => {
  const client = await pool.connect();

  try {
    const currentUser = loadUser(req);
    const userId = Number(req.params.userId);
    if (currentUser.id !== userId || currentUser.userrole !== "agent") {
      res.status(403).send("Unauthorized User");
    }
    console.log("currentUser.id ", currentUser.id);
    console.log("userId", userId);
    console.log("currentUser.userrole", currentUser.userrole);

    try {
      console.log("start in try");

      await client.query("BEGIN");

      const listing = await addListing(client, req);
      const images = await addImages(client, req, listing.id);
      res.status(200).json({ listing, images });

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

const updateProperty = async (req, res) => {
  const client = await pool.connect();

  try {
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

module.exports = { getProperties, getOneProperty, createListing };
