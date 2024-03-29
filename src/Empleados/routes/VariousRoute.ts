import express from "express";
const router = express.Router();

import {getAreas, getPositions, getCapturedAreas, getEmployeesByArea, getProductivityEmployeesByArea, getIncidences, getFilteredAreas } from "../controllers/Various";

router.get("/positions", getPositions);
router.get("/areas", getAreas);
router.get("/filteredareas", getFilteredAreas);
router.get("/incidences", getIncidences);
router.get("/capturedareas", getCapturedAreas);
router.get("/employeesbyarea", getEmployeesByArea);
router.post("/employeesnamebyarea", getProductivityEmployeesByArea);

export default router;
