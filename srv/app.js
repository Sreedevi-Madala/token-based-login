const express = require("express");
const jwt = require("jsonwebtoken");
const { getMaxListeners } = require("process");
const app = express();

const mongoose = require("mongoose");

const User = require("../db/models/user");

const MONGOURI =
  "mongodb+srv://sree_udemy:udemy1@clusterudemy.30rlo.mongodb.net/Users?retryWrites=true&w=majority";

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("Connected to DB !!");

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch {
    res.send("Error " + err);
  }
});

app.post("/post", (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const a1 = user.save();
    res.json(a1);
  } catch (err) {
    res.send("Error");
  }
});

app.post("/login", (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };
  jwt.sign({ user }, "secrettoken", (err, token) => {
    res.json({
      token,
    });
  });
});

app.get("/check", verifyToken, (req, res) => {
  res.json({
    message: "user checked",
    User: req.user,
  });
});

function verifyToken(req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Forbidden" });
  try {
    const decoded = jwt.verify(token, "secrettoken");
    console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
}

app.listen(5000, () => {
  console.group("Listening at port 5000");
});
