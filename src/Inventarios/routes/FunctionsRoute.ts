import express from "express";
const router = express.Router();
const multer = require("multer");

import { ConvertPdf } from "../controllers/Functions";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/pdf", upload.single("pdfFile"), ConvertPdf);

export default router;
