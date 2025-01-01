const express = require("express");

require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
const { mongodb_uri } = require("./config/constants");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use("/", routes);

mongoose.connect(mongodb_uri).then(() => {
  console.log("Connected to mongodb on", mongodb_uri);
  const port = 8000;
  app.listen(port, () => {
    console.log("API server running on http://localhost:", port);
  });
});
