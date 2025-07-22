const addListing = async (client, req) => {
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

  const listingPrice = Number(String(price).replace(/\$|,/g, ""));

  console.log(price, listingPrice);
  const text = `insert into listings (agent_id, propertyname, address, price, town, nearestmrt, unitsize ,bedroom,bathroom, typeoflease, description, status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning *`;
  const value = [
    agent_id,
    propertyname,
    address,
    listingPrice,
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
  const property = result.rows[0];
  return property;
};

module.exports = {
  addListing,
};
