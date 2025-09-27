const express = require("express");
const clientsRoutes = require("./clients");
const paymentRoutes = require("./payments");

const router = express.Router();

router.use("/clients", clientsRoutes);
router.use("/payments", paymentRoutes);

module.exports = router;
