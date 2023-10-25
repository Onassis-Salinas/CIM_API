const express = require("express");
const router = express.Router();

const VariousRoute = require("./routes/VariousRoute");
const DataRoute = require("./routes/DataRoute");
const AssistanceRoute = require("./routes/AssistanceRoute");
const ProductivityRoute = require("./routes/ProductivityRoute");
const InfoRoute = require("./routes/InfoRoute");

router.use("/data", DataRoute);
router.use("/assistance", AssistanceRoute);
router.use("/productivity", ProductivityRoute);
router.use("/various", VariousRoute);
router.use("/info", InfoRoute);

module.exports = router;
