import express, { Application } from "express";

import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes";
import { mongodb_uri } from "./config/constants";

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use("/", routes);

if (!mongodb_uri) {
  console.error("MongoDB URI is not defined in environment variables.");
  process.exit(1); 
}

mongoose
  .connect(mongodb_uri)
  .then(() => {
    console.log("Connected to MongoDB on", mongodb_uri);

    const port = 8000;
    app.listen(port, () => {
      console.log(`API server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
