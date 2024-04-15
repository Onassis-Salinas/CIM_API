import express from "express";
import { importMaterials } from "../controllers/Imports";
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/inventory", upload.single("excel"), importMaterials);

export default router;
