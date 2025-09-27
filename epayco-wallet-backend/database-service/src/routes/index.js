const express = require("express");
const clientRoutes = require("./clients");


const router = express.Router();

router.use("/clients", clientRoutes);

module.exports = router;
