const editListing = async (client, req, listingId) => {
  const {
    agent_id,
    propertyname,
    address,
    price,
    town,
    nearestmrt,
    unitsize,
    bedroom,
    bathroom,
    typeoflease,
    description,
    status,
  } = req.body;

  const keys = [
    "agent_id",
    "propertyname",
    "address",
    "price",
    "town",
    "nearestmrt",
    "unitsize",
    "bedroom",
    "bathroom",
    "typeoflease",
    "description",
    "status",
  ];
  const values = [
    agent_id,
    propertyname,
    address,
    price,
    town,
    nearestmrt,
    unitsize,
    bedroom,
    bathroom,
    typeoflease,
    description,
    status,
  ];

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
  editListing,
};
