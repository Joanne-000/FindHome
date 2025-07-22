const bcrypt = require("bcrypt");

const userSignUp = async (client, req, res) => {
  const saltRounds = 12;
  const {
    email,
    password,
    passwordconf,
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

  const role = userrole + "s";
  let user;

  const hashedpw = await bcrypt.hash(password, saltRounds);

  if (role === "agents") {
    const agentText = `insert into ${role} (email, hashedpw, displayname, contactnumber, userrole, licenseid, profilephoto, isactive) values ($1,$2,$3,$4,$5,$6,$7,$8) returning *`;
    const agentValue = [
      email,
      hashedpw,
      displayname,
      contactnumber,
      userrole,
      licenseid,
      profilephoto,
      isactive,
    ];

    const result = await client.query(agentText, agentValue);

    user = result.rows[0];
  } else {
    const budgetNum = Number(String(preferbudget).replace(/\$|,/g, ""));
    const buyerText = `insert into ${role} (email, hashedpw, displayname, contactnumber, userrole,prefercontactmethod, preferlocation, preferbudget,preferrooms, isactive) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning *`;
    const buyerValue = [
      email,
      hashedpw,
      displayname,
      contactnumber,
      userrole,
      prefercontactmethod,
      preferlocation,
      budgetNum,
      preferrooms,
      isactive,
    ];
    const result = await client.query(buyerText, buyerValue);

    user = result.rows[0];
  }
  return user;
};

module.exports = {
  userSignUp,
};
