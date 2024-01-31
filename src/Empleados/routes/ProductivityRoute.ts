import express from "express";
const router = express.Router();

import { getWeekProductivity, createProductivityWeek, updateData, getSingle } from "../controllers/Productivity";
import validatePermission from "../../middleware/validatePermission";

router.post("/week", validatePermission("productivity", "r"), getWeekProductivity);
router.post("/createweek", validatePermission("productivity", "w"), createProductivityWeek);
router.post("/getsingle", validatePermission("productivity", "r"), getSingle);
router.put("/", validatePermission("productivity", "w"), updateData);

export default router;
