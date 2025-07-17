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

const emailInBuyers = async (pool, email) => {
  const text = `select * from buyers where email = $1 AND isactive = $2`;
  const value = [email, "active"];
  const result = await pool.query(text, value);

  if (result.rows.length === 0) {
    return false;
  }
  return result;
};

module.exports = {
  createPayload,
  loadUserFromToken,
  emailInAgents,
  emailInBuyers,
};
