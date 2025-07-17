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
      return res.status(404).send({ err: "Listing not found." });
    }

    const listingwImagesP = listings.map(async(listing) => {
      const result = await pool.query(
        `select * from images where listing_id = $1`,
        [listing.id]
      );
      listing["images"] = result.rows;

      return listing
    })

    const listingswImages = await Promise.all(listingwImagesP);
    console.log("listingswImages",JSON.stringify(listingswImages,null,2))
    
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
    const listing = listingResult.rows;

    if (listing.length === 0) {
      return res.status(404).send({ err: "Listing not found." });
    }

    const imagesResult = await pool.query(
      `select * from images where listing_id = $1`,
      [listingId]
    );
    const images = imagesResult.rows;
console.log(images)

    res.status(200).json({ listing, images });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  getProperties,
  getOneProperty,
};
