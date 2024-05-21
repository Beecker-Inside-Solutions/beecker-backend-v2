const express = require("express");
const fileController = require("../controller/filesController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/files", upload.single('file'), fileController.addFile);
router.get("/files/:id", fileController.getFileByID);
router.get("/files", fileController.getAllFiles);
router.delete("/files/:id", fileController.deleteFile);

module.exports = router;