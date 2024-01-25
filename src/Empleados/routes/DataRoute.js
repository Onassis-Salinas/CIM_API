const express = require("express");
const router = express.Router();

const { getEmployeData, addEmployee, updateEmployee, quitEmployee, makeVacationReq } = require("../controllers/Data");
const validatePermission = require("../../middleware/validatePermission");

router.get("/", validatePermission("employees", "r"), getEmployeData);
router.post("/", validatePermission("employees", "w"), addEmployee);
router.put("/", validatePermission("employees", "w"), updateEmployee);
router.put("/quitemployee", validatePermission("employees", "w"), quitEmployee);
router.post("/vacation", validatePermission("assistance", "w"), makeVacationReq);

module.exports = router;
