const checkParams = (
  index,
  text,
  value,
  keywords,
  propertyType,
  maxPrice,
  postedDate,
  bedrooms,
  location
) => {
  console.log("in checkParams");
  if (keywords) {
    text += ` AND (propertyname ILIKE $${index} OR address ILIKE $${index} OR description ILIKE $${index} OR town ILIKE $${index} OR nearestmrt ILIKE $${index})`;
    value.push(`%${keywords}%`);
    index++;
  }

  if (propertyType) {
    text += ` AND (description ILIKE $${index} )`;
    value.push(`%${propertyType}%`);
    index++;
  }

  if (maxPrice) {
    text += ` AND ( price <= $${index} )`;
    value.push(Number(maxPrice));
    index++;
  }
  if (postedDate) {
    text += ` AND ( timestamptz > $${index} )`;
    value.push(`${postedDate}`);
    index++;
  }
  if (bedrooms) {
    text += ` AND ( bedroom = $${index})`;
    value.push(Number(bedrooms));
    index++;
  }
  if (location) {
    text += ` AND (propertyname ILIKE $${index} OR address ILIKE $${index} OR description ILIKE $${index} OR town ILIKE $${index} OR nearestmrt ILIKE $${index})`;
    value.push(`%${location}%`);
    index++;
  }
  text += ` order by timestamptz desc`;

  console.log("in checkParams result", text, value);
  return { text, value };
};

module.exports = {
  checkParams,
};
