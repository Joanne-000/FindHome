const saveUser = (req, user) => {
  req.user = user;
};

const loadUser = (req) => req.user;

const createPayload = (user) => {
  return {
    email: user.email,
    password: user.password,
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
  const result = await client.query(`select * from agents where email = $1`, [
    email,
  ]);
  return result;
};

const emailInBuyers = async (client, email) => {
  const result = await client.query(`select * from buyers where email = $1`, [
    email,
  ]);
  return result;
};

module.exports = {
  createPayload,
  saveUser,
  loadUser,
  emailInAgents,
  emailInBuyers,
};
