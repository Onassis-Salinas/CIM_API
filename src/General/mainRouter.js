const express = require("express");
const router = express.Router();

const UsersRoute = require("./routes/UserRoute");

router.use("/users", UsersRoute);

module.exports = router;
