const addImages = async (client, req, listingId) => {
  try {
    const { imageurls } = req.body;

    const text = `insert into images (listing_id,  imageurl) values ($1,$2) returning *`;
    const insertImages = imageurls.map(async (imageurl) => {
      const value = [listingId, imageurl];
      const insertImage = await client.query(text, value);
      return insertImage;
    });

    const results = await Promise.all(insertImages);
    return results.map((result) => result.rows[0]);
  } catch (err) {
    console.error("Failed to add images:", err);
    throw err;
  }
};

module.exports = {
  addImages,
};
