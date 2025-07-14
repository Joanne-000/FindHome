const addImages = async (client, req, propertyId) => {
  console.log("start in function");
  const { imageurl } = req.body;

  const text = `insert into images (property_id, imageurl) values ($1,$2) returning id`;
  const value = [propertyId, imageurl];
  const result = await client.query(text, value);

  const imageId = result.rows[0];

  const selectImages = await client.query(
    `select * from images where property_id = $1`,
    [propertyId]
  );
  const images = selectImages.rows;

  return images;
};

module.exports = {
  addImages,
};
