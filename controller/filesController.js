const fileService = require("../service/files.service");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileController = {
    upload,
    addFile: async (req, res) => {
        try {
            if (!req.file) {
                throw new Error("File is not provided");
            }
            const { incidentID } = req.body;
            const fileData = req.file.buffer;
            const result = await fileService.addFile(fileData, incidentID);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getFileByID: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await fileService.getFileByID(id);
            if (result.length === 0) {
                res.status(404).json({ message: "File not found" });
            } else {
                res.status(200).json(result[0]);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAllFiles: async (req, res) => {
        try {
            const result = await fileService.getAllFiles();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteFile: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await fileService.deleteFile(id);
            if (result.affectedRows === 0) {
                res.status(404).json({ message: "File not found" });
            } else {
                res.status(200).json({ message: "File deleted successfully" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = fileController;