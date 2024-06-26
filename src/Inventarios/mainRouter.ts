import express from "express";
const router = express.Router();

import inventoryRoute from "./routes/InventoryRoute";
import materialsRoute from "./routes/materialsRoute";
import movementsRoute from "./routes/movementsRoute";
import functionsRoute from "./routes/FunctionsRoute";
import exportsRoute from "./routes/exportsRoute";
import importsRoute from "./routes/importsRoute";

router.use("/movements", movementsRoute);
router.use("/inventory", inventoryRoute);
router.use("/materials", materialsRoute);
router.use("/functions", functionsRoute);
router.use("/exports", exportsRoute);
router.use("/imports", importsRoute);

export default router;
