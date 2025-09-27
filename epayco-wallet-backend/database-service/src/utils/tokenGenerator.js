const crypto = require("crypto");

const generateSixDigitToken = () => {
  return ("" + Math.floor(100000 + Math.random() * 900000)).padStart(6, "0");
};

const generateSessionId = () => crypto.randomUUID();

module.exports = { generateSixDigitToken, generateSessionId };
