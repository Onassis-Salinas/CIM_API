import express from "express";
const router = express.Router();
const multer = require("multer");

import { ConvertJobPdf, ConvertImportPdf } from "../controllers/Functions";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/jobpdf", upload.single("pdfFile"), ConvertJobPdf);
router.post("/importpdf", upload.single("pdfFile"), ConvertImportPdf);

export default router;
