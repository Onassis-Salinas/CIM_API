import express from "express";
const router = express.Router();
import { exportInventory } from "../controllers/Exports";

router.get("/", exportInventory);

export default router;
