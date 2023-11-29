const express = require("express");
const router = express.Router();

const { getEmployeData, addEmployee, updateEmployee, quitEmployee } = require("../controllers/Data");
const validatePermission = require("../../middleware/validatePermission");

router.get("/", validatePermission("employees", "r"), getEmployeData);
router.post("/", validatePermission("employees", "w"), addEmployee);
router.put("/", validatePermission("employees", "w"), updateEmployee);
router.put("/quitemployee", validatePermission("employees", "w"), quitEmployee);

module.exports = router;
