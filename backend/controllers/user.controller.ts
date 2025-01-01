import { Request, Response } from "express";
import { jwt_secret, API_KEY } from "../config/constants";
import { User } from "../models/user.model";
import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const getJwtSecret = (): string => {
  if (!jwt_secret) {
    console.error("JWT secret is not defined in environment variables.");
    throw new Error("JWT secret is missing");
  }
  return jwt_secret;
};

// Get data from external API
export const getData = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0/values/A1:Z100?key=${API_KEY}`
    );
    res.json(response.data);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Error fetching data");
  }
};

// Sign up a new user
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(409).send({ message: "Username already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });

    const token = jwt.sign({ username }, getJwtSecret(), { expiresIn: "1h" });

    res.status(201).send({
      message: "User created",
      data: { token },
    });
  } catch (error) {
    console.error("Backend error in sign up:", error);
    res.status(500).send("Error signing up");
  }
};

// Check authentication token
export const checkauth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    jwt.verify(token, getJwtSecret(), (err: any) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
        return;
      }
      res.status(200).send({ message: "Authenticated" });
    });
  } catch (error) {
    console.error("Backend error in check auth:", error);
    res.status(500).send("Error in check auth");
  }
};

// Sign in an existing user
export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      res.status(404).send({ message: "User doesn't exist" });
      return;
    }

    const hashedPassword = existingUser.password;
    if (!hashedPassword) {
      res.status(404).send({ message: "User doesn't exist" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      res.status(401).send({ message: "Incorrect password" });
      return;
    }

    const token = jwt.sign({ username }, getJwtSecret(), { expiresIn: "1h" });
    res.status(200).send({
      message: "User signed in",
      data: { token },
    });
  } catch (error) {
    console.error("Backend error in sign in:", error);
    res.status(500).send("Error signing in");
  }
};
