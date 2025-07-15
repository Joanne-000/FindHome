const addImages = async (client, req, listingId) => {
  console.log("start in addImages");
  const { coverimage, image1, image2, image3, image4 } = req.body;

  const text = `insert into images (listing_id,  coverimage,image1,image2,image3,image4) values ($1,$2,$3,$4,$5,$6) returning *`;
  const value = [listingId, coverimage, image1, image2, image3, image4];
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
