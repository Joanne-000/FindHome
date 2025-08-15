const editImages = async (client, req, listingId) => {
  try {
    await client.query("BEGIN");
    const { imageurls } = req.body;

    const result = await client.query(
      `SELECT imageurl FROM images WHERE listing_id = $1`,
      [listingId]
    );
    const existingImageUrls = result.rows.map((row) => row.imageurl);

    const imagesToAdd = imageurls.filter(
      (url) => !existingImageUrls.includes(url)
    );

    const imagesToDelete = existingImageUrls.filter(
      (url) => !imageurls.includes(url)
    );

    if (imagesToDelete.length > 0) {
      const deleteText = `DELETE FROM images WHERE listing_id = $1 AND imageurl = $2`;
      for (const url of imagesToDelete) {
        const value = [listingId, url];
        await client.query(deleteText, value);
      }
    }

    const text = `INSERT INTO images (listing_id, imageurl) VALUES ($1, $2) RETURNING *`;
    for (const url of imagesToAdd) {
      const value = [listingId, url];
      await client.query(text, value);
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error in updateListing:", err.message);
    throw err;
  }
};

module.exports = {
  editImages,
};
