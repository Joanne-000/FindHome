const { addImages } = require("./addImages");

const editImages = async (client, req, listingId) => {
  const { imageurls } = req.body;
  const text = `UPDATE images SET imageurl = $1 WHERE listing_id = $2 AND id = $3 RETURNING *`;
  const values = [newUrl, listingId, imageId];
  const result = await client.query(text, values);
  return result.rows[0];
};

module.exports = {
  editImages,
};
