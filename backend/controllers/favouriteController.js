const { loadUser } = require("../middleware/utils");
const { addListing } = require("../middleware/utils-addListing");
const { addImages } = require("../middleware/utils-addImages");
const { editListing, delListing } = require("../middleware/utils-editListing");
const { editImages } = require("../middleware/utils-editImages");

require("dotenv").config();
const pg = require("pg");
const { Pool } = pg;
const connection = process.env.PGCONNECT;
const pool = new Pool({ connectionString: connection });

const createFavourite = async (req, res) => {
  const client = await pool.connect();

  try {
    const currentUser = loadUser(req);
    const userId = Number(req.params.userId);
    const listingId = Number(req.params.listingId);

    if (currentUser.id !== userId || currentUser.userrole !== "buyer") {
      res.status(403).send("Unauthorized User");
    }
    try {
      console.log("start in try");
      await client.query("BEGIN");

      const text =
        "insert into favourites (buyer_id, listing_id) values ($1,$2) returning *";
      const value = [userId, listingId];
      const favResult = await client.query(text, value);
      const listing = favResult.rows[0];
      res.status(200).json(listing);

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

const getFavourites = async (req, res) => {
  const client = await pool.connect();

  try {
    const currentUser = loadUser(req);
    const userId = Number(req.params.userId);
    if (currentUser.id !== userId || currentUser.userrole !== "buyer") {
      res.status(403).send("Unauthorized User");
    }

    try {
      console.log("start in try");
      await client.query("BEGIN");

      const result = await client.query(
        `select * from favourites join listings on listings.id =  favourites.listing_id where buyer_id = $1`,
        [userId]
      );
      const fav = result.rows;

      if (fav.length === 0) {
        res.status(200).send("No favourite listings");
      }
      res.status(200).json(fav);

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

const destroyFavourite = async (req, res) => {
  const client = await pool.connect();

  try {
    const currentUser = loadUser(req);
    const userId = Number(req.params.userId);
    const listingId = Number(req.params.listingId);

    if (currentUser.id !== userId) {
      res.status(403).send("Unauthorized User");
    }

    try {
      console.log("start in try");
      await client.query("BEGIN");

      const listing = await delListing(client, req, listingId);
      res.status(200).json(listing);

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

module.exports = {
  getFavourites,
  createFavourite,
  destroyFavourite,
};
