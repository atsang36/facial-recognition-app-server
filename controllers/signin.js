const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Incorrect form submission");
  }
  try {
    const data = await db
      .select("email", "hash")
      .from("login")
      .where("email", "=", email);
    const isValid = bcrypt.compareSync(password, data[0].hash);
    if (isValid) {
      try {
        const user = await db
          .select("*")
          .from("users")
          .where("email", "=", email);
        res.json(user);
      } catch (error) {
        res.status(400).json("unable to get user");
      }
    } else {
      res.status(400).json("wrong credentials");
    }
  } catch (error) {
    res.status(400).json("wrong credentials");
  }
};
module.exports = {
  handleSignin: handleSignin,
};
