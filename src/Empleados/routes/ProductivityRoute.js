const express = require("express");
const router = express.Router();

const { getWeekProductivity, createProductivityWeek, updateData, getSingle } = require("../controllers/Productivity");
const validatePermission = require("../../middleware/validatePermission");

router.post("/week", validatePermission("productivity", "r"), getWeekProductivity);
router.post("/createweek", validatePermission("productivity", "w"), createProductivityWeek);
router.post("/getsingle", validatePermission("productivity", "r"), getSingle);
router.put("/", validatePermission("productivity", "w"), updateData);

module.exports = router;
