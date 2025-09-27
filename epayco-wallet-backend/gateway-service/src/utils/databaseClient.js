const axios = require("axios");

const baseURL = process.env.DB_SERVICE_URL || "http://localhost:5001";

const client = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = client;
