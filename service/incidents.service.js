const connection = require("../helpers/mysql-config");
const { executeTransaction } = require("../helpers/mysql-config");

const incidentService = {
  addIncident: async (
    incidentName = "",
    responsibleName = "",
    startDate = "",
    endDate = "",
    status = "",
    description = "",
    projectID = 0,
    progress = ""
  ) => {
    try {
      // Fetch the responsible user's ID based on the provided name and last name
      const [responsibleFirstName, responsibleLastName] =
        responsibleName.split(" ");
      const userQuery =
        "SELECT idUsers FROM Users WHERE name = ? AND lastName = ?";
      const [userRows] = await connection.query(userQuery, [
        responsibleFirstName,
        responsibleLastName,
      ]);
      const responsibleUserID = userRows[0].idUsers;

      const query =
        "INSERT INTO Incidents (incidentName, responsible, startDate, endDate, status, description, isActive, Project_idProject, progress) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)";
      const [result] = await connection.query(query, [
        incidentName,
        responsibleName,
        startDate,
        endDate,
        status,
        description,
        projectID,
        progress,
      ]);

      console.log("Incident added successfully");
      console.log("Incident ID:", result.insertId);
      console.log("Responsible User ID:", responsibleUserID);
    
      return {
        incidentID: result.insertId,
        responsibleUserID: responsibleUserID,
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
  deleteIncident: async (incidentID) => {
    try {
      // Delete files associated with the incident
      const deleteFilesQuery =
        "DELETE FROM Files WHERE Incidents_idIncident = ?";
      await connection.query(deleteFilesQuery, [incidentID]);

      // Delete the incident
      const deleteIncidentQuery = "DELETE FROM Incidents WHERE idIncident = ?";
      const [incidentResult] = await connection.query(deleteIncidentQuery, [
        incidentID,
      ]);

      return incidentResult;
    } catch (error) {
      console.error("Error deleting incident:", error);
      throw error;
    }
  },
};

module.exports = incidentService;
