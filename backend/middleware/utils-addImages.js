const addImages = async (client, req, listingId) => {
  console.log("start in addImages");
  const { imageurl } = req.body;

  const text = `insert into images (listing_id, imageurl) values ($1,$2) returning id`;
  const value = [listingId, imageurl];
  const result = await client.query(text, value);

  const imageId = result.rows;
  console.log("imageId", imageId);

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
