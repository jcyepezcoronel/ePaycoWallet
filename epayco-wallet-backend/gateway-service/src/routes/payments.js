const express = require("express");
const databaseClient = require("../utils/databaseClient");

const router = express.Router();

router.post("/initiate", async (req, res, next) => {
  try {
    const response = await databaseClient.post("/api/payments/initiate", req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

router.post("/confirm", async (req, res, next) => {
  try {
    const response = await databaseClient.post("/api/payments/confirm", req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
