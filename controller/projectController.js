const projectService = require("../service/project.service");

const projectController = {
  getProjects: async (req, res) => {
    try {
      const projects = await projectService.getProjects();

      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getProject: async (req, res) => {
    try {
      const { idProject } = req.params;
      const project = await projectService.getProject(idProject);

      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  addProject: async (req, res) => {
    try {
      const { projectName, projectDescription } = req.body;
      const response = await projectService.addProject(
        projectName,
        projectDescription
      );

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateProject: async (req, res) => {
    try {
      const { idProject } = req.params;
      const { projectName, projectDescription } = req.body;
      const response = await projectService.updateProject(
        idProject,
        projectName,
        projectDescription
      );

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteProject: async (req, res) => {
    try {
      const { idProject } = req.params;
      const response = await projectService.deleteProject(idProject);

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProjectByUserId: async (req, res) => {
    try {
      const { idUsers } = req.params;
      const projects = await projectService.getProjectByUserId(idUsers);

      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProjectByUserIdAndProjectId: async (req, res) => {
    try {
      const { idUsers, idProject } = req.params;
      const projects = await projectService.getProjectByUserIdAndProjectId(
        idUsers,
        idProject
      );

      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = projectController;