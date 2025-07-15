const editImages = async (client, req, listingId) => {
  console.log("start in addImages");
  const { imageurl } = req.body;

  const keys = ["imageurl"];
  const values = [imageurl];

  const setText = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
  console.log(setText);
  const text = `update images set ${setText} where listing_id = $${keys.length + 1} returning *`;
  const value = [...values, listingId];
  const result = await client.query(text, value);
  const propertyImages = result.rows;

  return propertyImages;
};

module.exports = {
  editImages,
};
