require("dotenv").config();
const { pool } = require("../index");

const getProperties = async (req, res) => {
  try {
    const listingsResult = await pool.query(
      `select * from listings where status = $1`,
      ["available"]
    );
    const listings = listingsResult.rows;

    if (listings.length === 0) {
      throw new Error("Listing not found.");
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

const getTop5Properties = async (req, res) => {
  try {
    const listingsResult = await pool.query(
      `select * from listings where status = $1  order by timestamptz desc limit 5 `,
      ["available"]
    );
    const listings = listingsResult.rows;

    if (listings.length === 0) {
      throw new Error("Listing not found.");
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

const getOneProperty = async (req, res) => {
  const listingId = Number(req.params.listingId);

  try {
    const listingResult = await pool.query(
      `select * from listings where id = $1 AND status  = $2`,
      [listingId, "available"]
    );
    const listing = listingResult.rows[0];
    console.log(listing);

    const agentId = listing.agent_id;

    if (listing.length === 0) {
      throw new Error("Listing not found.");
    }

    const imagesResult = await pool.query(
      `select * from images where listing_id = $1`,
      [listingId]
    );
    const images = imagesResult.rows;

    const agentResult = await pool.query(`select * from agents where id = $1`, [
      agentId,
    ]);
    const agent = agentResult.rows;
    console.log(agent);

    res.status(200).json({ listing, images, agent });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  getProperties,
  getTop5Properties,
  getOneProperty,
};
