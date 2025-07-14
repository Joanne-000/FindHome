const editUser = async (client, req, res) => {
  console.log("start in function");
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

  const role = userrole + "s";
  let user;

  if (role === "agents") {
    const values = [displayname, contactnumber, licenseid, profilephoto];

    const agentText = `update ${role} set displayname=$1, contactnumber=$2, licenseid= $3, profilephoto=$4 where email=$5 returning id`;
    const agentValue = [...values, email];
    const result = await client.query(agentText, agentValue);
    const agentId = result.rows[0].id;

    const selectUser = await client.query(
      `select * from ${role} where id = $1`,
      [agentId]
    );

    user = selectUser.rows[0];
  } else {
    const values = [
      displayname,
      contactnumber,
      prefercontactmethod,
      preferlocation,
      preferbudget,
      preferrooms,
    ];

    const buyerText = `update ${role} set displayname=$1, contactnumber=$2, prefercontactmethod= $3, preferlocation=$4, preferbudget=$5,preferrooms=$6 where email=$7 returning id`;
    const buyerValue = [...values, email];
    const result = await client.query(buyerText, buyerValue);
    const buyerId = result.rows[0].id;

    const selectUser = await client.query(
      `select * from ${role} where id = $1`,
      [buyerId]
    );

    user = selectUser.rows[0];
  }
  return user;
};

const delUser = async (client, req, res) => {
  console.log("start in function");
  const { email, userrole, isactive } = req.body;

  const role = userrole + "s";
  let user;

  const values = [isactive];

  const text = `update ${role} set isactive=$1 where email=$2 returning id`;
  const value = [...values, email];
  const result = await client.query(text, value);
  const userId = result.rows[0].id;

  const selectUser = await client.query(`select * from ${role} where id = $1`, [
    userId,
  ]);

  user = selectUser.rows[0];
  return user;
};

module.exports = {
  editUser,
  delUser,
};
