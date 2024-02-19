import express from "express";
const router = express.Router();
import { getWeeklyFires, getWeeklyHires, getDailyIncidence, getActiveEmployees, getAssistanceInfo, getEmployeeRotation, getemployeeTemplate, getAreaAssistanceInfo } from "../controllers/Info";

router.post("/weeklyfires", getWeeklyFires);
router.post("/weeklyhires", getWeeklyHires);
router.post("/dailyincidence", getDailyIncidence);
router.post("/assistanceinfo", getAssistanceInfo);
router.post("/areaassistanceinfo", getAreaAssistanceInfo);
router.post("/employeerotation", getEmployeeRotation);
router.get("/activeemployees", getActiveEmployees);
router.get("/employeeTemplate", getemployeeTemplate);


export default router;
