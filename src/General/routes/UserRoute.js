const express = require("express");
const router = express.Router();

const { loginUser, registerUser, editUser, getUsers } = require("../controllers/Users");
const validatePermission = require("../../middleware/validatePermission");
const validateReq = require("../../middleware/validateReq");

router.post("/login", validateReq(["Password", "UserName"]), loginUser);
router.post("/register", validatePermission("users", "w"), validateReq(["Password", "UserName"]), registerUser);
router.post("/edit", validatePermission("users", "w"), validateReq(["Perm_assistance", "Perm_employees", "Perm_productivity", "Perm_users", "UserName", "LastUserName"]), editUser);
router.get("/", validatePermission("users", "r"), getUsers);

module.exports = router;
