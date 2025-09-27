const express = require("express");
const clientsRoutes = require("./clients");

const router = express.Router();

router.use("/clients", clientsRoutes);

module.exports = router;
