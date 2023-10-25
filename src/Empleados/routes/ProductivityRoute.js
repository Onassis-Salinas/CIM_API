const express = require("express");
const router = express.Router();

const { getWeekProductivity, createProductivityWeek, updateData, getSingle } = require("../controllers/Productivity");

router.post("/week", getWeekProductivity);
router.post("/createweek", createProductivityWeek);
router.post("/getsingle", getSingle);

router.put("/", updateData);

module.exports = router;
