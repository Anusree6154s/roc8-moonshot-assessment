const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const { User } = require("./models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const jwt_secret = "secret";

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Route to get data from Google Sheets
app.get("/getData", async (req, res) => {
  const API_KEY = process.env.api_key;
  try {
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0/values/A1:Z100?key=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error fetching data");
  }
});

app.post("/question2/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(209).send({ message: "Username already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });

    const token = jwt.sign({ username }, jwt_secret, { expiresIn: "1h" });

    res.status(201).send({
      message: "User created",
      data: { token },
    });
  } catch (error) {
    console.error("Backend error in sign up:", error);
    res.status(500).send("Error signing up");
  }
});

app.post("/question2/checkauth", async (req, res) => {
  try {
    const { token } = req.body;
    jwt.verify(token, jwt_secret, (err) => {
      if (err) return res.status(401).send({ message: "Invalid Token" });
      res.status(200).send({ message: "Authenticated" });
    });
  } catch (error) {
    console.error("Backend error in check auth:", error);
    res.status(500).send("Error in check auth");
  }
});

app.post("/question2/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser)
      return res.status(404).send({ message: "User doesn't exist" });

    const hashedPassword = existingUser.password;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid)
      return res.status(401).send({ message: "Incorrect password" });

    const token = jwt.sign({ username }, jwt_secret, { expiresIn: "1h" });
    res.status(200).send({
      message: "User signed in",
      data: { token },
    });
  } catch (error) {
    console.error("Backend error in sign in:", error);
    res.status(500).send("Error signing in");
  }
});

mongoose
  .connect("mongodb://127.0.0.1:27017/roc8-moonshot-assessment")
  .then(() => {
    console.log(
      "Connected to mongodb on",
      "mongodb://127.0.0.1:27017/roc8-moonshot-assessment"
    );
    const port = 8000;
    app.listen(port, () => {
      console.log("API server running on http://localhost:", port);
    });
  });
