const express = require("express");
const router = express.Router();

const multer = require("multer");

const { ConvertPdf } = require("../controllers/Functions");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/pdf", upload.single("pdfFile"), ConvertPdf);

module.exports = router;
