const delUser = async (pool, req, res, currentUser) => {
  const { email, isactive } = req.body;

  const role = currentUser.userrole + "s";
  let user;

  const text = `update ${role} set isactive=$1 where email=$2 returning *`;
  const value = [isactive, email];
  const result = await pool.query(text, value);
  user = result.rows[0];
  return user;
};

module.exports = {
  delUser,
};
