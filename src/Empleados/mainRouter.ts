import express from "express";
const router = express.Router();

import VariousRoute from "./routes/VariousRoute";
import DataRoute from "./routes/DataRoute";
import AssistanceRoute from "./routes/AssistanceRoute";
import ProductivityRoute from "./routes/ProductivityRoute";
import InfoRoute from "./routes/InfoRoute";

router.use("/data", DataRoute);
router.use("/assistance", AssistanceRoute);
router.use("/productivity", ProductivityRoute);
router.use("/various", VariousRoute);
router.use("/info", InfoRoute);

export default router;
