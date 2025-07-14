const addProperty = async (client, req) => {
  console.log("start in function");
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

  const text = `insert into properties (agent_id, propertyname, address, price, town, nearestmrt, unitsize ,bedroom,bathroom, typeoflease, description, status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning id`;
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
  console.log("result", result);

  const listingId = result.rows[0];
  console.log("listingId", listingId);

  const selectProperty = await client.query(
    `select * from properties where id = $1`,
    [listingId.id]
  );
  console.log("selectProperty", selectProperty);

  property = selectProperty.rows[0];
  return property;
};

module.exports = {
  addProperty,
};
