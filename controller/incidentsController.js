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
        projectID,
        progressDate
      } = req.body;
      const response = await incidentService.addIncident(
        incidentName,
        responsible,
        startDate,
        endDate,
        status,
        description,
        projectID,
        progressDate
      );

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getIncidentByID: async (req, res) => {
    try {
      const { idIncident } = req.params;
      const incident = await incidentService.getIncidentByID(idIncident);

      res.status(200).json(incident);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
        projectID,
        progressDate
      } = req.body;
      const response = await incidentService.updateIncident(
        idIncident,
        incidentName,
        responsible,
        startDate,
        endDate,
        status,
        description,
        projectID,
        progressDate
      );

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = incidentController;
