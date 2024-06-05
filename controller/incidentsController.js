const incidentService = require("../service/incidents.service");

const incidentController = {
  addIncident: async (req, res) => {
    try {
      const {
        incidentName,
        responsible,
        startDate,
        endDate,
        status,
        description,
        Project_idProject,
        progress,
      } = req.body;

      // Input validation
      if (
        !incidentName ||
        !responsible ||
        !startDate ||
        !status.toString() || // Ensure status is converted to string
        !Project_idProject.toString() // Ensure Project_idProject is converted to string
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const response = await incidentService.addIncident(
        incidentName,
        responsible,
        startDate,
        endDate,
        status,
        description,
        Project_idProject,
        progress
      );

      res.status(201).json({
        message: "Incident added successfully",
        incidentID: response.incidentID,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  getIncidentByID: async (req, res) => {
    try {
      const { idIncident } = req.params;

      if (!idIncident) {
        return res.status(400).json({ message: "Incident ID is required" });
      }

      const incident = await incidentService.getIncidentByID(idIncident);

      if (!incident) {
        return res.status(404).json({ message: "Incident not found" });
      }

      res.status(200).json(incident);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  getAllIncidents: async (req, res) => {
    try {
      const incidents = await incidentService.getAllIncidents();
      res.status(200).json(incidents);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
  updateIncident: async (req, res) => {
    try {
      const { idIncident } = req.params;
      const {
        incidentName,
        responsible,
        startDate,
        endDate,
        status,
        description,
        Project_idProject,
        progress,
      } = req.body;

      if (
        !idIncident ||
        !incidentName ||
        !responsible ||
        !startDate ||
        status === undefined || // Check if status is undefined
        Project_idProject === undefined // Check if Project_idProject is undefined
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const response = await incidentService.updateIncident(
        idIncident,
        incidentName,
        responsible,
        startDate,
        endDate,
        status,
        description,
        Project_idProject,
        progress
      );

      if (response.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Incident not found or no change in data" });
      }

      res.status(200).json({ message: "Incident updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  deleteIncident: async (req, res) => {
    try {
      const { idIncident } = req.params;

      if (!idIncident) {
        return res.status(400).json({ message: "Incident ID is required" });
      }

      const response = await incidentService.deleteIncident(idIncident);

      if (response.affectedRows === 0) {
        return res.status(404).json({ message: "Incident not found" });
      }

      res.status(200).json({ message: "Incident deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
};

module.exports = incidentController;
