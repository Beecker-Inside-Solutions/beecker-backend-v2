const connection = require("../helpers/mysql-config");

const fileService = {
  addFile: async (fileData, mimeType, fileName, incidentID) => {
    try {
      const query = "INSERT INTO Files (file, fileType, fileName, Incidents_idIncident) VALUES (?, ?, ?, ?)";
      const [rows] = await connection.query(query, [fileData, mimeType, fileName, incidentID]);

      return rows;
    } catch (error) {
      throw error;
    }
  },

  getFileByID: async (fileID) => {
    try {
      const query = "SELECT file, fileType, fileName FROM Files WHERE idFiles = ?";
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
  },

  getAllFilesByIncidentID: async (incidentID) => {
    try {
      const query = "SELECT * FROM Files WHERE Incidents_idIncident = ?";
      const [rows] = await connection.query(query, [incidentID]);

      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = fileService;
