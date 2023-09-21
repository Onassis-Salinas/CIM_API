const express = require("express");
const router = express.Router();

const {
    getInventory,
    updateInventory,
    postInventory,
} = require("../controllers/Inventory");

router.get("/", getInventory);
router.post("/", postInventory);
router.put("/", updateInventory);

module.exports = router;
