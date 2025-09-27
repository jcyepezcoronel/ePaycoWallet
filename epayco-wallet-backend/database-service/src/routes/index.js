const express = require("express");
const clientRoutes = require("./clients");
const paymentRoutes = require("./payments");
const walletRoutes = require("./wallet");

const router = express.Router();

router.use("/clients", clientRoutes);
router.use("/payments", paymentRoutes);
router.use("/wallets", walletRoutes);

module.exports = router;
