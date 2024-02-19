import express from "express";
const router = express.Router();
import { getInventory, updateInventory, postInventory } from "../controllers/Inventory";

router.get("/", getInventory);
router.post("/", postInventory);
router.put("/", updateInventory);

export default router;
