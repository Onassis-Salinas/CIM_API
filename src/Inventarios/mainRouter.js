const express = require("express");
const router = express.Router();

const inventoryRoute = require("./routes/InventoryRoute");
const materialsRoute = require("./routes/materialsRoute");
const movementsRoute = require("./routes/movementsRoute");
const functionsRoute = require("./routes/FunctionsRoute");
const exportsRoute = require("./routes/exportsRoute");

router.use("/movements", movementsRoute);
router.use("/inventory", inventoryRoute);
router.use("/materials", materialsRoute);
router.use("/functions", functionsRoute);
router.use("/exports", exportsRoute);

module.exports = router;