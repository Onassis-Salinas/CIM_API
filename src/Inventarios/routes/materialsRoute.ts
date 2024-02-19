import express from "express";
const router = express.Router();
import { getMaterials, postMaterials, getMaterial } from "../controllers/materials";

router.post("/unique", getMaterial);
router.get("/", getMaterials);

router.post("/", postMaterials);

export default router;
