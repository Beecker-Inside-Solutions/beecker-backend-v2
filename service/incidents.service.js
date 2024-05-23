const connection = require("../helpers/mysql-config");

const incidentService = {
    addIncident: async (incidentName = "", responsible = "", startDate = "", endDate = "", status = "", description = "", projectID = 0, progresss = "") => {
        try {
            const query = "INSERT INTO Incidents (incidentName, responsible, startDate, endDate, status, description, isActive, Project_idProject, progresss) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)";
            const [rows] = await connection.query(query, [incidentName, responsible, startDate, endDate, status, description, projectID, progresss]);

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

    updateIncident: async (incidentID = "", incidentName = "", responsible = "", startDate = "", endDate = "", status = "", description = "", progresss = "") => {
        try {
            const query = "UPDATE Incidents SET incidentName = ?, responsible = ?, startDate = ?, endDate = ?, status = ?, description = ?, progresss = ? WHERE idIncident = ?";
            const [rows] = await connection.query(query, [incidentName, responsible, startDate, endDate, status, description, progresss, incidentID]);

            return rows;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = incidentService;

