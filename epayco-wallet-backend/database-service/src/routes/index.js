const express = require("express");
const clientRoutes = require("./clients");
const paymentRoutes = require("./payments");


const router = express.Router();

router.use("/clients", clientRoutes);
router.use("/payments", paymentRoutes);

module.exports = router;
