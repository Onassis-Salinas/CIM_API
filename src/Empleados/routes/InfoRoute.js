const express = require("express");
const router = express.Router();

const { getWeeklyFires, getWeeklyHires, getDailyIncidence, getActiveemployees } = require("../controllers/Info");

router.post("/weeklyfires", getWeeklyFires);
router.post("/weeklyhires", getWeeklyHires);
router.post("/dailyincidence", getDailyIncidence);
router.get("/activeemployees", getActiveemployees);

module.exports = router;
