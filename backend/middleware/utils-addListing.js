const addListing = async (client, req) => {
  console.log("start in addListing");
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

  const text = `insert into listings (agent_id, propertyname, address, price, town, nearestmrt, unitsize ,bedroom,bathroom, typeoflease, description, status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning id`;
  const value = [
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
  const result = await client.query(text, value);

  const listingId = result.rows[0];

  const selectProperty = await client.query(
    `select * from listings where id = $1`,
    [listingId.id]
  );

  const property = selectProperty.rows[0];
  return property;
};

module.exports = {
  addListing,
};
