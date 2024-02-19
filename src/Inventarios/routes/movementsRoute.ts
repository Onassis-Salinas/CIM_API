import express from "express";
const router = express.Router();
import { getExpo, getMaterial, postInput, postOutput, putMovement, updateAmount } from "../controllers/movements";

router.put("/checked", putMovement);
router.post("/Expo", getExpo);
router.post("/Expo", getExpo);
router.post("/material", getMaterial);
router.post("/input", postInput);
router.post("/output", postOutput);
router.post("/updateamount", updateAmount);

export default router;
