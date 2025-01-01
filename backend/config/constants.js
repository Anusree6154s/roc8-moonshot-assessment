require("dotenv").config();

exports.jwt_secret = process.env.jwt_secret;
exports.API_KEY = process.env.api_key;
exports.mongodb_uri = process.env.mongodb_uri
