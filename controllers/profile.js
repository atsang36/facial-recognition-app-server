const handleProfile = async (req, res, db) => {
  const id = req.params;

  try {
    const users = await db.select("*").from("users").where({
      id,
    });
    if (users.length) {
      res.json(users[0]);
    } else {
      res.status(400).json("user not found");
    }
  } catch (err) {
    res.status(400).json("error retrieving user");
  }
};
module.exports = {
  handleProfile: handleProfile,
};
