const editImages = async (client, req, listingId) => {
  console.log("start in editImages");
  const { coverimage, image1, image2, image3, image4 } = req.body;

  const keys = ["coverimage", "image1", "image2", "image3", "image4"];
  const values = [coverimage, image1, image2, image3, image4];

  const setText = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
  const text = `update images set ${setText} where listing_id = $${keys.length + 1} returning *`;
  const value = [...values, listingId];
  const result = await client.query(text, value);
  const propertyImages = result.rows[0];

  return propertyImages;
};

module.exports = {
  editImages,
};
