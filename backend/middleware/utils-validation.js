const validator = require("validator");

const signinValidation = (req) => {
  const { email, password } = req.body;
  if (!email || !validator.isEmail(email)) {
    throw new Error("A valid email is required");
  }
  if (!password || password.length < 3) {
    throw new Error("{Password must be at least 3 charaters}");
  }
};

const dataValidation = (req) => {
  const {
    email,
    displayname,
    contactnumber,
    userrole,
    licenseid,
    profilephoto,
    isactive,
    prefercontactmethod,
    preferlocation,
    preferbudget,
    preferrooms,
  } = req.body;

  if (!email || !validator.isEmail(email)) {
    throw new Error("A valid email is required");
  }

  if (!displayname || displayname.trim().length < 3) {
    throw new Error("Display name must be at least 3 characters");
  }

  if (!contactnumber || contactnumber.trim().length < 8) {
    throw new Error("Contact Number must be at least 8 characters");
  }

  if (userrole !== "buyer" && userrole !== "agent") {
    throw new Error("Account type can only be either agent or buyer");
  }

  if (isactive !== "active" && isactive !== "deleted") {
    throw new Error("Status can only be active or deleted");
  }

  if (userrole === "agent") {
    if (!licenseid || licenseid.trim().length < 9) {
      throw new Error("License ID must be at least 9 characters");
    }

    if (!profilephoto || !profilephoto.trim()) {
      throw new Error(
        "Profile photo is required for an agent, please provide an image URL"
      );
    }
  }

  if (userrole === "buyer") {
    const contactMethod = ["whatsapp", "phone call", "sms", "email"];
    if (!prefercontactmethod || prefercontactmethod.includes(contactMethod)) {
      throw new Error(
        "Contact method can only be Whatsapp, phone call, SMS or email"
      );
    }

    const town = [
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
    if (!preferlocation || preferlocation.includes(town)) {
      throw new Error("Please choose a town from the dropdown list");
    }

    const budgetNum = Number(String(preferbudget).replace(/\$|,/g, ""));
    if (!budgetNum || isNaN(budgetNum) || budgetNum < 50000) {
      throw new Error(
        "Preferred budget must be a valid number greater than $50,000.00"
      );
    }

    const roomsNum = Number(preferrooms);
    if (!preferrooms || isNaN(roomsNum) || roomsNum < 1) {
      throw new Error("Preferred room number must not be 0");
    }
  }
};

module.exports = {
  signinValidation,
  dataValidation,
};
``;
