const validator = require("validator");

const loadUserFromToken = (req) => req.user;

const createPayload = (user) => {
  return {
    id: user.id,
    email: user.email,
    hashedpw: user.hashedpw,
    displayname: user.displayname,
    contactnumber: user.contactnumber,
    userrole: user.userrole,
    licenseid: user.licenseid,
    isactive: user.isactive,
    prefercontactmethod: user.prefercontactmethod,
    preferlocation: user.preferlocation,
    preferbudget: user.preferbudget,
    preferrooms: user.preferrooms,
  };
};

const emailInAgents = async (pool, email) => {
  const text = `select * from agents where email = $1 AND isactive = $2`;
  const value = [email, "active"];
  const result = await pool.query(text, value);

  if (result.rows.length === 0) {
    return false;
  }
  return result;
};

const emailInBuyers = async (client, email) => {
  const text = `select * from buyers where email = $1 AND isactive = $2`;
  const value = [email, "active"];
  const result = await client.query(text, value);

  if (result.rows.length === 0) {
    return false;
  }
  return result;
};

const dataValidation = (req, res) => {
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

  if (!displayname || !validator.isEmail(email)) {
    return res.status(400).json({ err: "A valid email is required" });
  }

  if (!displayname || displayname.trim().length < 3) {
    return res
      .status(400)
      .json({ err: "Display name must be at least 3 characters" });
  }

  if (!contactnumber || contactnumber.trim().length < 8) {
    return res
      .status(400)
      .json({ err: "Contact Number must be at least 8 characters" });
  }

  if (userrole !== "buyer" && userrole !== "agent") {
    console.log(req.body);
    return res
      .status(400)
      .json({ err: "Account type can only be either agent or buyer" });
  }

  if (isactive !== "active" && isactive !== "deleted") {
    return res
      .status(400)
      .json({ err: "Status can only be active or deleted" });
  }

  if (userrole === "agent") {
    if (!licenseid || licenseid.trim().length < 9) {
      return res
        .status(400)
        .json({ err: "License ID must be at least 9 characters" });
    }

    if (!profilephoto || profilephoto.trim()) {
      return res.status(400).json({
        err: "Profile photo is required for an agent, please provide an image URL",
      });
    }
  }

  if (userrole === "buyer") {
    const contactMethod = ["whatsapp", "phone call", "sms", "email"];
    if (!prefercontactmethod || prefercontactmethod.includes(contactMethod)) {
      return res.status(400).json({
        err: "Contact method can only be Whatsapp, phone call, SMS or email",
      });
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
      return res
        .status(400)
        .json({ err: "Please choose a town from the dropdown list" });
    }

    const budgetNum = Number(preferbudget);
    if (!preferbudget || isNaN(budgetNum) || budgetNum <= 0) {
      return res
        .status(400)
        .json({
          err: "Preferred budget must be a valid number greater than 0",
        });
    }

    const roomsNum = Number(preferrooms);
    if (!preferrooms || isNaN(roomsNum) || roomsNum <= 0) {
      return res
        .status(400)
        .json({ err: "Preferred room number must be greater than 0" });
    }
  }
};

module.exports = {
  createPayload,
  loadUserFromToken,
  emailInAgents,
  emailInBuyers,
  dataValidation,
};
