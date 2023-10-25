const express = require("express");
const router = express.Router();

const { getEmployeData, addEmployee, updateEmployee } = require("../controllers/Data");

router.get("/", getEmployeData);
router.post("/", addEmployee);
router.put("/", updateEmployee);

module.exports = router;
