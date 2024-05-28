const connection = require("../helpers/mysql-config");

const fileService = {
  addFile: async (fileData, incidentID) => {
    try {
      // Encode fileData to base64
      const base64Data = fileData.toString("base64");

      const query =
        "INSERT INTO Files (file, Incidents_idIncident) VALUES (?, ?)";
      const [rows] = await connection.query(query, [base64Data, incidentID]);

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
  },
};

module.exports = fileService;
