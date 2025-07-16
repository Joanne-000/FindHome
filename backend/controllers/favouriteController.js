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
// put this pool into a seperate file , then you inport to everywhere

const createFavourite = async (req, res) => {
  const client = await pool.connect();

  try {
    const currentUser = loadUser(req);
    const userId = Number(req.params.userId);
    const listingId = Number(req.params.listingId);

    if (currentUser.id !== userId || currentUser.userrole !== "buyer") {
      res.status(403).send("Unauthorized User");
    }

    const text =
      "insert into favourites (buyer_id, listing_id) values ($1,$2) returning *";
    const value = [userId, listingId];
    const favResult = await client.query(text, value);
    const listing = favResult.rows[0];
    res.status(200).json(listing);
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

    const result = await client.query(
      /* sql */ `select favourites.id AS favourite_id,
        listings.id AS listing_id,
        listings.propertyname,
        listings.address,
        listings.price,
        listings.town,
        listings.nearestmrt,
        listings.unitsize,
        listings.bedroom,
        listings.bathroom,
        listings.typeoflease,
        listings.description,
        listings.status,
        listings.timestamptz,
        favourites.buyer_id
        from favourites join listings on listings.id =  favourites.listing_id where buyer_id = $1`,
      [userId]
    );
    const fav = result.rows;

    if (fav.length === 0) {
      res.status(200).send("No favourite listings");
    }
    res.status(200).json(fav);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const destroyFavourite = async (req, res) => {
  const client = await pool.connect();

  try {
    const currentUser = loadUser(req);
    const userId = Number(req.params.userId);
    const favId = Number(req.params.favId);

    if (currentUser.id !== userId || currentUser.userrole !== "buyer") {
      res.status(403).send("Unauthorized User");
    }

    const result = await client.query(`delete from favourites where id = $1`, [
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
  createFavourite,
  destroyFavourite,
};
