import express from "express";
const router = express.Router();

import { getdayAssistance, getWeekAssistance, getEmployeAssistance, createAssistanceWeek, changeEmployeAssistance } from "../controllers/Assistance";
import validatePermission from "../../middleware/validatePermission";

router.post("/day", validatePermission("assistance", "r"), getdayAssistance);
router.post("/week", validatePermission("assistance", "r"), getWeekAssistance);
router.post("/single", validatePermission("assistance", "r"), getEmployeAssistance);
router.post("/createweek", validatePermission("assistance", "w"), createAssistanceWeek);
router.put("/", validatePermission("assistance", "w"), changeEmployeAssistance);

export default router;
