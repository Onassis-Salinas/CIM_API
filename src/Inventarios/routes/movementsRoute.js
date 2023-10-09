const express = require("express");
const router = express.Router();

const {
    getExpo,
    getMaterial,
    postInput,
    postOutput,
    putMovement,
    updateAmount,
} = require("../controllers/movements");

router.put("/checked", putMovement);
router.post("/Expo", getExpo);
router.post("/Expo", getExpo);
router.post("/material", getMaterial);
router.post("/input", postInput );
router.post("/output", postOutput );
router.post("/updateamount", updateAmount );

module.exports = router;
