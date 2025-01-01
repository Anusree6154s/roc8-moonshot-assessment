const express = require("express");
const {
  getData,
  signup,
  checkauth,
  signin,
} = require("../controllers/user.controller");

const routes = express.Router()

routes
  .get("/getData", getData)
  .post("/question2/signup", signup)
  .post("/question2/checkauth", checkauth)
  .post("/question2/signin", signin);

  module.exports = routes