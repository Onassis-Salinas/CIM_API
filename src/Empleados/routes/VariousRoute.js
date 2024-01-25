const express = require("express");
const router = express.Router();

const { getAreas, getPositions, getCapturedAreas, getEmployeesByArea, getProductivityEmployeesByArea, getIncidences } = require("../controllers/Various");

router.get("/positions", getPositions);
router.get("/areas", getAreas);
router.get("/incidences", getIncidences);
router.get("/capturedareas", getCapturedAreas);
router.get("/employeesbyarea", getEmployeesByArea);
router.post("/employeesnamebyarea", getProductivityEmployeesByArea);

module.exports = router;
