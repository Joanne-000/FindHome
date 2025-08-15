const delListing = async (client, req, listingId) => {
  const { status } = req.body;

  const keys = ["status"];
  const values = [status];

  const setText = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
  const text = `update listings set ${setText} where id = $${
    keys.length + 1
  } returning *`;
  const value = [...values, listingId];
  const result = await client.query(text, value);
  const property = result.rows[0];

  return property;
};
module.exports = {
  delListing,
};
