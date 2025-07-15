const addImages = async (client, req, listingId) => {
  console.log("start in addImages");
  const { imageurl } = req.body;

  const text = `insert into images (listing_id, imageurl) values ($1,$2) returning *`;
  const value = [listingId, imageurl];
  await client.query(text, value);

  const selectPropertyImages = await client.query(
    `select * from images where listing_id = $1`,
    [listingId]
  );
  const propertyImages = selectPropertyImages.rows;
  console.log("propertyImages", propertyImages);

  return propertyImages;
};

module.exports = {
  addImages,
};
