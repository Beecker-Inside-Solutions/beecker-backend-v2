const connection = require("../helpers/mysql-config");

const fileService = {
    addFile: async (fileData, incidentID) => {
        try {
            const query = "INSERT INTO Files (file, Incidents_idIncident) VALUES (?, ?)";
            const [rows] = await connection.query(query, [fileData, incidentID]);

            return rows;
        } catch (error) {
            throw error;
        }
    },

    getFileByID: async (fileID) => {
        try {
            const query = "SELECT * FROM Files WHERE idFiles = ?";
            const [rows] = await connection.query(query, [fileID]);

            return rows;
        } catch (error) {
            throw error;
        }
    },

    getAllFiles: async () => {
        try {
            const query = "SELECT * FROM Files";
            const [rows] = await connection.query(query);

            return rows;
        } catch (error) {
            throw error;
        }
    },

    deleteFile: async (fileID) => {
        try {
            const query = "DELETE FROM Files WHERE idFiles = ?";
            const [rows] = await connection.query(query, [fileID]);

            return rows;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = fileService;