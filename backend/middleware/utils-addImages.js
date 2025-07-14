const addImages = async (client, req, listingId) => {
  console.log("start in function");
  const { imageurl } = req.body;

  const text = `insert into images (listing_id, imageurl) values ($1,$2) returning id`;
  const value = [listingId, imageurl];
  const result = await client.query(text, value);

  const imageId = result.rows[0];

  const selectImages = await client.query(
    `select * from images where listing_id = $1`,
    [listingId]
  );
  const images = selectImages.rows;

  return images;
};

module.exports = {
  addImages,
};
