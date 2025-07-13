const userSignUp = async (client, req, res) => {
  const saltRounds = 12;
  console.log("start in function");
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

  const role = userRole + "s";
  let user;

  const hashedPW = await bcrypt.hash(password, saltRounds);

  if (role === "agents") {
    const agentText = `insert into ${role} (email, password, displayname, contactnumber, userrole, licenseid, profilephoto, isactive) values ($1,$2,$3,$4,$5,$6,$7,$8) returning id`;
    const agentValue = [
      email,
      hashedPW,
      displayname,
      contactnumber,
      userrole,
      licenseid,
      profilephoto,
      isactive,
    ];

    const result = await client.query(agentText, agentValue);
    const agentId = result.rows[0];
    const selectUser = await client.query(
      `select * from ${role} where id = $1`,
      [agentId.id]
    );

    user = selectUser.rows[0];
  } else {
    const buyerText = `insert into ${role} (email, password, displayname, contactnumber, userrole,prefercontactmethod, preferlocation, preferbudget,preferrooms, isactive) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning id`;
    const buyerValue = [
      email,
      hashedPW,
      displayname,
      contactnumber,
      userrole,
      prefercontactmethod,
      preferlocation,
      preferbudget,
      preferrooms,
      isactive,
    ];
    const result = await client.query(buyerText, buyerValue);
    const buyerId = result.rows[0];

    const selectUser = await client.query(
      `select * from ${role} where id = $1`,
      [buyerId.id]
    );
    user = selectUser.rows[0];
  }
  return user;
};

module.exports = {
  userSignUp,
};
