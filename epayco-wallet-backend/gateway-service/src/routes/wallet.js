const express = require("express");
const databaseClient = require("../utils/databaseClient");

const router = express.Router();

router.post("/top-up", async (req, res, next) => {
  try {
    const response = await databaseClient.post("/api/wallets/top-up", req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

router.get("/balance", async (req, res, next) => {
  try {
    const response = await databaseClient.get("/api/wallets/balance", { params: req.query });
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
