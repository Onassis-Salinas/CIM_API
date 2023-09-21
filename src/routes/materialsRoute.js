const express = require("express");
const router = express.Router();

const { getMaterials, postMaterials, getMaterial } = require("../controllers/materials");

router.post("/unique", getMaterial);
router.get("/", getMaterials);

router.post("/", postMaterials);

module.exports = router;
