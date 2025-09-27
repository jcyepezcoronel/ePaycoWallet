const express = require("express");
const { initiatePayment, confirmPayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/initiate", initiatePayment);
router.post("/confirm", confirmPayment);

module.exports = router;
