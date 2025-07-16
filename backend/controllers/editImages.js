const { addImages } = require("./addImages");

const editImages = async (client, req, listingId, imageId) => {
  const imageurls = req.body.images;

  const imageurl = imageurls.find((img) => img.id === imageId);
  console.log(req.body);
  const text = `UPDATE images SET imageurl = $1 WHERE listing_id = $2 AND id = $3 RETURNING *`;
  const values = [imageurl, listingId, imageId];
  await client.query(text, values);

  const selectAllImages = await client.query(
    `select * from images where listing_id = $1`,
    [listingId]
  );
  return selectAllImages.rows;
};

module.exports = {
  editImages,
};
