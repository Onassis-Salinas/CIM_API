const express = require("express");
const router = express.Router();

const { getEmployeData, addEmployee, updateEmployee, quitEmployee } = require("../controllers/Data");

router.get("/", getEmployeData);
router.post("/", addEmployee);
router.put("/", updateEmployee);
router.put("/quitemployee", quitEmployee);

module.exports = router;
