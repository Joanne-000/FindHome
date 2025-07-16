require("dotenv").config();
const { pool } = require("../index");

const getProperties = async (req, res) => {
  try {
    const listingResult = await pool.query(
      /* sql */ `SELECT listings.id AS listing_id,
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
        images.id AS image_id,
        images.coverimage, images.image1,images.image2,images.image3,images.image4 
        FROM listings JOIN images ON images.listing_id = listings.id where status = $1 `,
      ["available"]
    );
    const listing = listingResult.rows;
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const getOneProperty = async (req, res) => {
  const listingId = Number(req.params.listingId);

  try {
    const listingResult = await pool.query(
      `select * from listings where id = $1 AND status  = $2`,
      [listingId, "available"]
    );
    const listing = listingResult.rows;

    if (listing.length === 0) {
      return res.status(404).send({ err: "Listing not found." });
    }

    const imagesResult = await pool.query(
      `select * from images where listing_id = $1`,
      [listingId]
    );
    const images = imagesResult.rows;
    res.status(200).json({ listing, images });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  getProperties,
  getOneProperty,
};
