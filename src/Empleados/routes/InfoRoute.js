const express = require("express");
const router = express.Router();

const { getWeeklyFires, getWeeklyHires, getDailyIncidence, getActiveemployees, getAssistanceInfo, getEmployeeRotation, getemployeeTemplate } = require("../controllers/Info");

router.post("/weeklyfires", getWeeklyFires);
router.post("/weeklyhires", getWeeklyHires);
router.post("/dailyincidence", getDailyIncidence);
router.post("/assistanceinfo", getAssistanceInfo);
router.post("/employeerotation", getEmployeeRotation);
router.get("/activeemployees", getActiveemployees);
router.get("/employeeTemplate", getemployeeTemplate);

module.exports = router;
