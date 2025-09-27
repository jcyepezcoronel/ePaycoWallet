const express = require("express");
const clientsRoutes = require("./clients");
const paymentRoutes = require("./payments");
const walletRoutes = require("./wallet");

const router = express.Router();

router.use("/clients", clientsRoutes);
router.use("/payments", paymentRoutes);
router.use("/wallets", walletRoutes);

module.exports = router;
