import dotenv from "dotenv";
dotenv.config();

export const jwt_secret = process.env.jwt_secret;
export const API_KEY = process.env.api_key;
export const mongodb_uri = process.env.mongodb_uri;
