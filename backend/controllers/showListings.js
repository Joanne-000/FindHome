require("dotenv").config();
const { pool } = require("../index");

const getProperties = async (req, res) => {
  // console.log("query", req.query);
  console.log("query", req.query.filters);

  try {
    const { keywords, propertyType, maxPrice, postedDate, bedrooms, location } =
      req.query;

    let text = `select * from listings where status = $1`;
    const value = ["available"];

    let index = 2;
    if (keywords) {
      text += ` AND (propertyname ILIKE $${index} OR address ILIKE $${index} OR description ILIKE $${index} OR town ILIKE $${index} OR nearestmrt ILIKE $${index})`;
      value.push(`%${keywords}%`);
      index++;
    }

    if (propertyType) {
      text += ` AND (description ILIKE $${index} )`;
      value.push(`%${propertyType}%`);
      index++;
    }

    if (maxPrice) {
      console.log("query", Number(maxPrice));

      text += ` AND ( price < $${index} )`;
      value.push(Number(maxPrice));
      index++;
    }
    if (postedDate) {
      text += ` AND ( timestamptz > $${index} )`;
      value.push(`${postedDate}`);
      index++;
    }
    if (bedrooms) {
      text += ` AND ( bedroom = $${index})`;
      value.push(Number(bedrooms));
      index++;
    }
    if (location) {
      text += ` AND (propertyname ILIKE $${index} OR address ILIKE $${index} OR description ILIKE $${index} OR town ILIKE $${index} OR nearestmrt ILIKE $${index})`;
      value.push(`%${location}%`);
      index++;
    }
    text += ` order by timestamptz desc`;

    const listingsResult = await pool.query(text, value);

    const listings = listingsResult.rows;

    if (listings.length === 0) {
      res.status(200).json(listings);
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
      res.status(200).json(listings);
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

const getTop5FavProperties = async (req, res) => {
  try {
    let text = `  SELECT 
    favourites.listing_id,
    COUNT(*) AS frequency,
    listings.*
  FROM favourites
  JOIN listings ON listings.id = favourites.listing_id
  WHERE listings.status = $1
  GROUP BY favourites.listing_id, listings.id
  ORDER BY frequency DESC
  LIMIT 5`;
    const value = ["available"];

    const top5favListingsResult = await pool.query(text, value);
    const listings = top5favListingsResult.rows;
    console.log("top 5 fav", listings);

    if (listings.length === 0) {
      return res.status(200).json(listings);
    }

    const listingwImagesP = listings.map(async (listing) => {
      const result = await pool.query(
        `select * from images where listing_id = $1`,
        [listing.id]
      );
      listing["images"] = result.rows;
      console.log("top 5 fav", listings);
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

    res.status(200).json({ listing, images, agent });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  getProperties,
  getTop5Properties,
  getTop5FavProperties,
  getOneProperty,
};
