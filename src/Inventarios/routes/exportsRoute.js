const express = require("express");
const router = express.Router();
 
const {exportInventory} = require("../controllers/Exports")

router.get("/", exportInventory);

module.exports = router;
