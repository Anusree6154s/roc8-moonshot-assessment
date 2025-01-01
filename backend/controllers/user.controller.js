const { jwt_secret, API_KEY } = require("../config/constants");
const { User } = require("../models/user.model");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.getData = async (req, res) => {
  try {
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0/values/A1:Z100?key=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error fetching data");
  }
};

exports.signup = async (req, res) => {
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
};

exports.checkauth = async (req, res) => {
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
};

exports.signin = async (req, res) => {
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
};
