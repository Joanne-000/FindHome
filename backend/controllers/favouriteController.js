const { loadUserFromToken } = require("../middleware/utils");
const { addListing } = require("./addListing");
const { addImages } = require("./addImages");
const { editListing, delListing } = require("./editListing");
const { editImages } = require("./editImages");

require("dotenv").config();
const { pool } = require("../index");

// put this pool into a seperate file , then you inport to everywhere

const getFavourites = async (req, res) => {
  try {
    const currentUser = loadUserFromToken(req);
    const userId = req.params.userId;

    if (currentUser.id !== userId) {
      throw new Error("Unauthorized User");
    }

    const favResult = await pool.query(
      /* SQL */ `select * from favourites join listings on listings.id = favourites.listing_id where user_id = $1`,
      [userId]
    );
    const listings = favResult.rows;

    if (listings.length === 0) {
      throw new Error("No favourite listings");
    }

    const listingwImagesP = listings.map(async (listing) => {
      const result = await pool.query(
        `select * from images where listing_id = $1`,
        [listing.id]
      );
      listing["images"] = result.rows;

      return listing;
    });

    const listingswImages = await Promise.all(listingwImagesP);

    res.status(200).json(listingswImages);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const favourite = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const currentUser = loadUserFromToken(req);
    const userId = req.params.userId;
    const listingId = Number(req.params.listingId);

    if (currentUser.id !== userId) {
      throw new Error("Unauthorized User");
    }

    const checkFavId = async () => {
      const result = await client.query(
        /* SQL */ `select * from favourites where listing_id = $1 AND user_id = $2`,
        [listingId, currentUser.id]
      );

      if (result.rows.length === 0) {
        return false;
      }
      const favId = result.rows[0].id;
      return favId;
    };
    const favId = await checkFavId();

    if (favId) {
      await client.query(`delete from favourites where id = $1`, [favId]);
      await client.query("COMMIT");
      res.status(200).json("Remove listing from favourite list");
    } else {
      const text =
        "insert into favourites (user_id, listing_id) values ($1,$2) returning *";
      const value = [userId, listingId];
      const favResult = await client.query(text, value);
      const listing = favResult.rows[0];

      await client.query("COMMIT");
      res.status(200).json(listing);
    }
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error in createListing:", err.message);
    res.status(500).json({ err: err.message });
  } finally {
    client.release();
  }
};

const createFavourite = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const currentUser = loadUserFromToken(req);
    const userId = req.params.userId;
    const listingId = Number(req.params.listingId);

    if (currentUser.id !== userId) {
      throw new Error("Unauthorized User");
    }

    const checkFavId = async () => {
      const result = await client.query(
        /* SQL */ `select * from favourites where listing_id = $1 AND user_id = $2`,
        [listingId, currentUser.id]
      );

      if (result.rows.length === 0) {
        return false;
      }
      const favId = result.rows[0];
      return favId;
    };
    const favId = checkFavId();

    if (!favId) {
      const text =
        "insert into favourites (user_id, listing_id) values ($1,$2) returning *";
      const value = [userId, listingId];
      const favResult = await client.query(text, value);
      const listing = favResult.rows[0];

      await client.query("COMMIT");
      res.status(200).json(listing);
    } else {
      await pool.query(`delete from favourites where id = $1`, [favId]);
      await client.query("COMMIT");
      res.status(200).json("Remove listing from favourite list");
    }
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error in createListing:", err.message);
    res.status(500).json({ err: err.message });
  } finally {
    client.release();
  }
};

const destroyFavourite = async (req, res) => {
  try {
    const currentUser = loadUserFromToken(req);
    const userId = req.params.userId;
    const favId = Number(req.params.favId);

    if (currentUser.id !== userId || currentUser.userrole !== "buyer") {
      throw new Error("Unauthorized User");
    }

    const result = await pool.query(`delete from favourites where id = $1`, [
      favId,
    ]);
    const fav = result.rows;
    res.status(200).send("Removed listing from favourite list");
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  getFavourites,
  favourite,
  createFavourite,
  destroyFavourite,
};
