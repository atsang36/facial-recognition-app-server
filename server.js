const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "123456",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "123",
      name: "Sally",
      email: "sally@gmail.com",
      password: "123456",
      entries: 0,
      joined: new Date(),
    },
  ],
};
``;
app.get("/", (req, res) => {
  res.send(database.users);
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});

app.post("/signin", (req, res) => {
  database.users.forEach((user) => {
    if (req.body.email === user.email && req.body.password === user.password) {
      bcrypt.compare("bacon", hash, function (err, res) {
        // res == true
      });
      res.json(database.users[0]);
    } else {
      res.status(400).json("Error logging in");
    }
  });
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function (err, hash) {
    // Store hash in your password DB.
  });

  database.users.push({
    id: "999",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });

  res.status(200).json(database.users[database.users.length - 1]);
});

app.post("/profile/:id", (req, res) => {
  const id = req.params;
  const isFound = false;

  database.users.forEach((user) => {
    if (user.id === id) {
      isFound = true;
      return res.status(200).json(user);
    }
  });

  if (!isFound) {
    res.status(400).json("user not found");
  }
});

app.put("/image", (req, res) => {
  const id = req.body;
  const isFound = false;

  database.users.forEach((user) => {
    if (user.id === id) {
      isFound = true;
      user.entries++;
      return res.status(200).json(user.entries);
    }
  });

  if (!isFound) {
    res.status(400).json("user not found");
  }
});
