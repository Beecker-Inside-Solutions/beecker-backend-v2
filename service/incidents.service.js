const connection = require("../helpers/mysql-config");

const incidentService = {
    addIncident: async (incidentName = "", responsible = "", startDate = "", endDate = "", status = "", description = "", projectID = 0, progressDate = "") => {
        try {
            const query = "INSERT INTO Incidents (incidentName, responsible, startDate, endDate, status, description, isActive, Project_idProject, progressDate) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)";
            const [rows] = await connection.query(query, [incidentName, responsible, startDate, endDate, status, description, projectID, progressDate]);

            return rows;
        } catch (error) {
            throw error;
        }
    },

    getIncidentByID: async (incidentID = "") => {
        try {
            const query = "SELECT * FROM Incidents WHERE idIncident = ?";
            const [rows] = await connection.query(query, [incidentID]);

            return rows;
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

    updateIncident: async (incidentID = "", incidentName = "", responsible = "", startDate = "", endDate = "", status = "", description = "", progressDate = "") => {
        try {
            const query = "UPDATE Incidents SET incidentName = ?, responsible = ?, startDate = ?, endDate = ?, status = ?, description = ?, progressDate = ? WHERE idIncident = ?";
            const [rows] = await connection.query(query, [incidentName, responsible, startDate, endDate, status, description, incidentID, progressDate]);

            return rows;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = incidentService;

