const express = require("express");
const router = express.Router();

import { loginUser, registerUser, editUser, getUsers } from "../controllers/Users";
import validatePermission from "../../middleware/validatePermission";
import validateReq from "../../middleware/validateReq";

router.post("/login", validateReq(["Password", "UserName"]), loginUser);
router.post("/register", validatePermission("users", "w"), validateReq(["Password", "UserName"]), registerUser);
router.post("/edit", validatePermission("users", "w"), validateReq(["Perm_assistance", "Perm_employees", "Perm_productivity", "Perm_users", "UserName", "LastUserName"]), editUser);
router.get("/", validatePermission("users", "r"), getUsers);

export default router;
