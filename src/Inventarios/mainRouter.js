const express = require("express");
const router = express.Router();

const inventoryRoute = require("./routes/InventoryRoute");
const materialsRoute = require("./routes/materialsRoute");
const movementsRoute = require("./routes/movementsRoute");
const functionsRoute = require("./routes/FunctionsRoute");
const exportsRoute = require("./routes/exportsRoute");

app.use("/movements", movementsRoute);
app.use("/inventory", inventoryRoute);
app.use("/materials", materialsRoute);
app.use("/functions", functionsRoute);
app.use("/exports", exportsRoute);

module.exports = router;