const { loadUser } = require("../middleware/utils");
const { addListing } = require("../middleware/utils-addListing");
const { addImages } = require("../middleware/utils-addImages");
const { editListing } = require("../middleware/utils-editListing");
const { editImages } = require("../middleware/utils-editImages");

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
      //   const listingResult = await client.query(`SELECT * FROM listings `);

      //   const listing = listingResult.rows;

      //   res.status(200).json(listing);

      const listingResult = await client.query(`select * from listings`);
      const listing = listingResult.rows;

      const imagesResult = await client.query(`select * from images`);
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

const getOneProperty = async (req, res) => {
  const client = await pool.connect();
  const listingId = Number(req.params.listingId);

  try {
    try {
      console.log("start in try");
      await client.query("BEGIN");

      //   const listingResult = await client.query(
      //     `SELECT * FROM images JOIN listings ON listings.id = images.listing_id where listings.id = $1 `,
      //     [listingId]
      //   );

      //       const listingResult = await client.query(
      //         `SELECT listings.id AS listing_id,
      //   listings.propertyname,
      //   listings.address,
      //   listings.price,
      //   listings.town,
      //   listings.nearestmrt,
      //   listings.unitsize,
      //   listings.bedroom,
      //   listings.bathroom,
      //   listings.typeoflease,
      //   listings.description,
      //   listings.status,
      //   listings.timestamptz,
      //   images.id AS image_id,
      //   images.imageurl FROM listings  JOIN images ON images.listing_id = listings.id where listings.id = $1 `,
      //         [listingId]
      //       );
      //       const listing = listingResult.rows;

      const listingResult = await client.query(
        `select * from listings where id = $1`,
        [listingId]
      );
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

    try {
      console.log("start in try");

      await client.query("BEGIN");

      const listing = await addListing(client, req);
      console.log("listing", listing);

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

const updateListing = async (req, res) => {
  const client = await pool.connect();

  try {
    const currentUser = loadUser(req);
    const userId = Number(req.params.userId);
    const listingId = Number(req.params.listingId);
    if (currentUser.id !== userId || currentUser.userrole !== "agent") {
      res.status(403).send("Unauthorized User");
    }
    try {
      console.log("start in try");

      await client.query("BEGIN");

      const listing = await editListing(client, req, listingId);
      console.log("listing", listing);

      const images = await editImages(client, req, listingId);
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

module.exports = {
  getProperties,
  getOneProperty,
  createListing,
  updateListing,
};
