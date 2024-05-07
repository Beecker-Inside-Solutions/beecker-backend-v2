const express = require('express');
const router = express.Router();
const incidentController = require('../controller/incidentsController');

// Ruta para agregar un nuevo incidente
router.post('/incidents', incidentController.addIncident);

// Ruta para obtener un incidente por su ID
router.get('/incidents/:idIncident', incidentController.getIncidentByID);

// Ruta para obtener todos los incidentes
router.get('/incidents', incidentController.getAllIncidents);

// Ruta para actualizar un incidente existente
router.put('/incidents/:idIncident', incidentController.updateIncident);

module.exports = router;
