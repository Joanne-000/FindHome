const userSignIn = async (client, req, res) => {
  const { email, password, userRole } = req.body;

  const role = userRole + "s";
  let user;

  const selectUser = await client.query(
    `select * from ${role} where email = $1`,
    [email]
  );
};
