import express from "express";
const router = express.Router();

import { getEmployeData, addEmployee, updateEmployee, quitEmployee, makeVacationReq, getEmployeeModel, getDataForExcel } from "../controllers/Data";
import validatePermission from "../../middleware/validatePermission";

router.get("/", validatePermission("employees", "r"), getEmployeData);
router.get("/excel", getDataForExcel);
router.get("/model", validatePermission("employees", "r"), getEmployeeModel);
router.post("/", validatePermission("employees", "w"), addEmployee);
router.put("/", validatePermission("employees", "w"), updateEmployee);
router.put("/quitemployee", validatePermission("employees", "w"), quitEmployee);
router.post("/vacation", validatePermission("assistance", "w"), makeVacationReq);

export default router;
