const validator = require("validator");

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

    if (!profilephoto || !profilephoto.trim()) {
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
    if (!preferbudget || isNaN(budgetNum) || budgetNum < 50000) {
      return res.status(400).json({
        err: "Preferred budget must be a valid number greater than 50000",
      });
    }

    const roomsNum = Number(preferrooms);
    if (!preferrooms || isNaN(roomsNum) || roomsNum < 1) {
      return res
        .status(400)
        .json({ err: "Preferred room number must not be 0" });
    }
  }
};

const listingValidation = (req, res) => {
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

    if (!profilephoto || !profilephoto.trim()) {
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
    if (!preferbudget || isNaN(budgetNum) || budgetNum < 50000) {
      return res.status(400).json({
        err: "Preferred budget must be a valid number greater than 50000",
      });
    }

    const roomsNum = Number(preferrooms);
    if (!preferrooms || isNaN(roomsNum) || roomsNum < 1) {
      return res
        .status(400)
        .json({ err: "Preferred room number must not be 0" });
    }
  }
};

module.exports = {
  dataValidation,
};
