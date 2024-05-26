const connection = require("../helpers/mysql-config");

const incidentService = {
  addIncident: async (
    incidentName = "",
    responsible = "",
    startDate = "",
    endDate = "",
    status = "",
    description = "",
    projectID = 0,
    progress = ""
  ) => {
    try {
      const query =
        "INSERT INTO Incidents (incidentName, responsible, startDate, endDate, status, description, isActive, Project_idProject, progress) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)";
      const [result] = await connection.query(query, [
        incidentName,
        responsible,
        startDate,
        endDate,
        status,
        description,
        projectID,
        progress,
      ]);

      return {
        incidentID: result.insertId,
      };
    } catch (error) {
      throw error;
    }
  },

  getIncidentByID: async (incidentID = "") => {
    try {
      const query = "SELECT * FROM Incidents WHERE idIncident = ?";
      const [rows] = await connection.query(query, [incidentID]);

      return rows[0]; // Assuming you want to return the first incident if found
    } catch (error) {
      throw error;
    }
  },

  getAllIncidents: async () => {
    try {
      const query = "SELECT * FROM Incidents";
      const [rows] = await connection.query(query);

      return rows;
    } catch (error) {
      throw error;
    }
  },

  updateIncident: async (
    incidentID = "",
    incidentName = "",
    responsible = "",
    startDate = "",
    endDate = "",
    status = "",
    description = "",
    progress = ""
  ) => {
    try {
      const query =
        "UPDATE Incidents SET incidentName = ?, responsible = ?, startDate = ?, endDate = ?, status = ?, description = ?, progress = ? WHERE idIncident = ?";
      const [result] = await connection.query(query, [
        incidentName,
        responsible,
        startDate,
        endDate,
        status,
        description,
        progress,
        incidentID,
      ]);

      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = incidentService;
