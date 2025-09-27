const express = require("express");
const databaseClient = require("../utils/databaseClient");
const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const response = await databaseClient.post("/api/clients/register", req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
