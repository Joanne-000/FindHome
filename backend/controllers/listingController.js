const { loadUserFromToken } = require("../middleware/utils");
const { addListing } = require("./addListing");
const { addImages } = require("./addImages");
const { editListing, delListing } = require("./editListing");
const { editImages } = require("./editImages");

require("dotenv").config();
const { pool } = require("../index");

const createListing = async (req, res) => {
  const client = await pool.connect();

  try {
    const currentUser = loadUserFromToken(req);
    const userId = Number(req.params.userId);
    if (currentUser.id !== userId || currentUser.userrole !== "agent") {
      return res.status(403).send("Unauthorized User");
    }

    console.log("start in try");
    await client.query("BEGIN");

    const listing = await addListing(client, req);
    const images = await addImages(client, req, listing.id);
    const listingWithImageURLs = { ...listing, images: images };
    await client.query("COMMIT");
    res.status(200).json(listingWithImageURLs);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error in createListing:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

const updateListing = async (req, res) => {
  const client = await pool.connect();

  try {
    const currentUser = loadUserFromToken(req);
    const userId = Number(req.params.userId);
    const listingId = Number(req.params.listingId);

    if (currentUser.id !== userId || currentUser.userrole !== "agent") {
      return res.status(403).send("Unauthorized User");
    }
    console.log("start in try");
    await client.query("BEGIN");

    const listing = await editListing(client, req, listingId);
    const images = await editImages(client, req, listingId);
    const listingWithImageURLs = { ...listing, images: images };
    await client.query("COMMIT");
    res.status(200).json(listingWithImageURLs);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error in updateListing:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

const destroyListing = async (req, res) => {
  try {
    const currentUser = loadUserFromToken(req);
    const userId = Number(req.params.userId);
    const listingId = Number(req.params.listingId);

    if (currentUser.id !== userId || currentUser.userrole !== "agent") {
      return res.status(403).send("Unauthorized User");
    }

    await client.query("BEGIN");
    const listing = await delListing(client, req, listingId);
    await client.query("COMMIT");

    res.status(200).json(listing);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ err: err.message });
  } finally {
    client.release();
  }
};

module.exports = {
  createListing,
  updateListing,
  destroyListing,
};
