import express from "express";
const router = express.Router();
import { getExpo, getMaterial, getMaterialResume, postInput, postOutput, putMovement, updateAmount } from "../controllers/movements";

router.put("/checked", putMovement);
router.post("/Expo", getExpo);
router.post("/material", getMaterial);
router.post("/materialresume", getMaterialResume);
router.post("/input", postInput);
router.post("/output", postOutput);
router.post("/updateamount", updateAmount);

export default router;
