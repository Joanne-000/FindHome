const saveUser = (req, user) => {
  req.user = user;
};

const loadUser = (req) => req.user;

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

const emailInAgents = async (client, email) => {
  const text = `select * from agents where email = $1, isactive = $2`;
  const value = [email, "active"];
  const result = await client.query(text, value);
  console.log(result.rows[0]);
  console.log(result.rows.length);
  if (result.rows.length === 0) {
    return false;
  }
  return true;
};

const emailInBuyers = async (client, email) => {
  const text = `select * from buyers where email = $1, isactive = $2`;
  const value = [email, "active"];
  const result = await client.query(text, value);

  console.log(result.rows[0]);
  console.log(result.rows.length);

  if (result.rows.length === 0) {
    return false;
  }
  return true;
};

module.exports = {
  createPayload,
  saveUser,
  loadUser,
  emailInAgents,
  emailInBuyers,
};
