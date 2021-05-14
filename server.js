const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const db = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "",
    database: "image-recognition",
  },
});

app.get("/", (req, res) => {
  const users = await db.select("*").from("users");
  res.send(users);
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});

app.post("/signin", (req, res) => {
  try {
    const data = await db
      .select("email", "hash")
      .from("login")
      .where("email", "=", req.body.email);
    const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
    if (isValid) {
      try {
        const user = await db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email);
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
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .insert({ email: loginEmail, name: name, joined: new Date() })
          .returning("*")
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    res.status(400).json("Unable to register");
  });

  await trx("users")
    .insert({ email: loginEmail, name: name, joined: new Date() })
    .returning("*")
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => {
      res.status(400).json("Unable to register");
    });
});

app.post("/profile/:id", async (req, res) => {
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
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  try {
    await db("users")
      .where("id", "=", id)
      .increment("entries", 1)
      .returning("entries");
    res.json(users[0]);
  } catch (err) {
    res.status(400).json("unable to get entries");
  }
});
