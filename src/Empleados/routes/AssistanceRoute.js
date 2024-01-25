const express = require("express");
const router = express.Router();

const { getdayAssistance, getWeekAssistance, getEmployeAssistance, createAssistanceWeek, changeEmployeAssistance } = require("../controllers/Assistance");
const validatePermission = require("../../middleware/validatePermission");

router.post("/day", validatePermission("assistance", "r"), getdayAssistance);
router.post("/week", validatePermission("assistance", "r"), getWeekAssistance);
router.post("/single", validatePermission("assistance", "r"), getEmployeAssistance);
router.post("/createweek", validatePermission("assistance", "w"), createAssistanceWeek);
router.put("/", validatePermission("assistance", "w"), changeEmployeAssistance);

module.exports = router;
