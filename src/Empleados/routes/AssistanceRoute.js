const express = require("express");
const router = express.Router();

const { getdayAssistance, getWeekAssistance, getEmployeAssistance, createAssistanceWeek, changeEmployeAssistance } = require("../controllers/Assistance");

router.post("/day", getdayAssistance);
router.post("/week", getWeekAssistance);
router.post("/single", getEmployeAssistance);
router.post("/createweek", createAssistanceWeek);
router.put("/", changeEmployeAssistance);

module.exports = router;
