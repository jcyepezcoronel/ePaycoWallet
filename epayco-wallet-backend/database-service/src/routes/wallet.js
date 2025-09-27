const express = require("express");
const { topUpWallet, getWalletBalance } = require("../controllers/walletController");

const router = express.Router();

router.post("/top-up", topUpWallet);
router.get("/balance", getWalletBalance);

module.exports = router;
