const { addImages } = require("./addImages");

const editImages = async (client, req, listingId) => {
  try {
    await client.query("BEGIN");
    const { imageurls } = req.body;
    console.log("imageurls", imageurls);
    console.log("req.body", req.body);

    await client.query(`delete from images where listing_id = $1`, [listingId]);
    addImages(client, req, listingId);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error in updateListing:", err.message);
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  editImages,
};
