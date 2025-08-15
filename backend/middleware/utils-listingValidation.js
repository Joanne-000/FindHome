const dataValidation = (req) => {
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
    imageurls,
  } = req.body;

  if (!propertyname || propertyname.trim().length < 5) {
    throw new Error("Property name is required");
  }

  if (!address || address.trim().length < 5) {
    throw new Error("Address is required");
  }

  const listingPrice = Number(String(price).replace(/\$|,/g, ""));
  if (!listingPrice || isNaN(listingPrice) || listingPrice < 50000) {
    throw new Error(
      "Listing price must be a valid number greater than $50,000.00"
    );
  }

  const statusList = ["available", "deleted"];
  if (!status || status.includes(statusList)) {
    throw new Error("Status can only be available or deleted");
  }

  const SGtown = [
    "Ang Mo Kio",
    "Bedok",
    "Bishan",
    "Bukit Batok",
    "Bukit Merah",
    "Bukit Panjang",
    "Bukit Timah",
    "Central Area",
    "Choa Chu Kang",
    "Clementi",
    "Geylang",
    "Hougang",
    "Jurong East",
    "Jurong West",
    "Kallang",
    "Lim Chu Kang",
    "Mandai",
    "Marine Parade",
    "Novena",
    "Pasir Ris",
    "Punggol",
    "Queenstown",
    "Sembawang",
    "Sengkang",
    "Serangoon",
    "Tampines",
    "Tanglin",
    "Toa Payoh",
    "Tuas",
    "Woodlands",
    "Yishun",
  ];

  if (!town || town.includes(SGtown)) {
    throw new Error("Please choose a town from the dropdown list");
  }

  if (!nearestmrt || nearestmrt.trim().length < 3) {
    throw new Error("Please provide a valid MRT station");
  }
  if (description && description.trim().length < 5) {
    throw new Error("Please provide a valid description");
  }
  const unitSize = Number(unitsize);
  if (!unitSize || isNaN(unitSize) || unitSize < 1) {
    throw new Error("Unit size must not be 0");
  }

  const roomNum = Number(bedroom);
  if (!roomNum || isNaN(roomNum) || roomNum < 1) {
    throw new Error("Bedroom number must not be 0");
  }

  const bathNum = Number(bathroom);
  if (!bathNum || isNaN(bathNum) || bathNum < 1) {
    throw new Error("Bathroom number must not be 0");
  }

  if (!typeoflease || typeoflease.trim().length < 5) {
    throw new Error("Type of Lease is required");
  }

  if (description && description.trim().length < 5) {
    throw new Error("Please type a valid description");
  }

  if (imageurls.length > 0) {
    for (const imageurl of imageurls) {
      if (imageurl.trim().length < 5)
        throw new Error("Please provide a valid image URL");
    }
  }
};

module.exports = {
  dataValidation,
};
