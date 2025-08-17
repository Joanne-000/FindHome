const checkParams = (
  page,
  index,
  text,
  countText,
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
    countText += ` AND (propertyname ILIKE $${index} OR address ILIKE $${index} OR description ILIKE $${index} OR town ILIKE $${index} OR nearestmrt ILIKE $${index})`;
    value.push(`%${keywords}%`);
    index++;
  }

  if (propertyType) {
    text += ` AND (description ILIKE $${index} )`;
    countText += ` AND (description ILIKE $${index} )`;
    value.push(`%${propertyType}%`);
    index++;
  }

  if (maxPrice) {
    text += ` AND ( price <= $${index} )`;
    countText += ` AND ( price <= $${index} )`;
    value.push(Number(maxPrice));
    index++;
  }
  if (postedDate) {
    text += ` AND ( timestamptz > $${index} )`;
    countText += ` AND ( timestamptz > $${index} )`;
    value.push(`${postedDate}`);
    index++;
  }
  if (bedrooms) {
    text += ` AND ( bedroom = $${index})`;
    countText += ` AND ( bedroom = $${index})`;
    value.push(Number(bedrooms));
    index++;
  }
  if (location) {
    text += ` AND (propertyname ILIKE $${index} OR address ILIKE $${index} OR description ILIKE $${index} OR town ILIKE $${index} OR nearestmrt ILIKE $${index})`;
    countText += ` AND (propertyname ILIKE $${index} OR address ILIKE $${index} OR description ILIKE $${index} OR town ILIKE $${index} OR nearestmrt ILIKE $${index})`;
    value.push(`%${location}%`);
    index++;
  }
  text += ` order by timestamptz desc`;

  const itemPerPage = 6;
  if (page) {
    const currentPage = Number(page);
    text += ` limit ${itemPerPage} offset ${(page - 1) * itemPerPage}`;
  }

  return { text, value, countText };
};

module.exports = {
  checkParams,
};
