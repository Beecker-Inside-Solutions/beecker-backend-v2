const connection = require("../helpers/mysql-config");

const projectService = {
  getProjects: async () => {
    try {
      const [rows] = await connection.query("SELECT * FROM Projects");

      return rows;
    } catch (error) {
      throw error;
    }
  },
  getProject: async (idProject) => {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM Projects WHERE idProject = ?",
        [idProject]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },
  addProject: async (projectName, projectDescription) => {
    try {
      const [rows] = await connection.query(
        "INSERT INTO Projects (projectName, projectDescription) VALUES (?, ?)",
        [projectName, projectDescription]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },
  updateProject: async (idProject, projectName, projectDescription) => {
    try {
      const [rows] = await connection.query(
        "UPDATE Projects SET projectName = ?, projectDescription = ? WHERE idProject = ?",
        [projectName, projectDescription, idProject]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },
  deleteProject: async (idProject) => {
    try {
      const [rows] = await connection.query(
        "DELETE FROM Projects WHERE idProject = ?",
        [idProject]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get all the projects related to a user
  getProjectByUserId: async (idUsers) => {
    try {
      const [rows] = await connection.query(
        "SELECT Project.* FROM Users INNER JOIN Project ON Users.idUsers = Project.Users_idUsers WHERE Users.idUsers = ?",
        [idUsers]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },
  // Get a specific project related to a user
  getProjectByUserIdAndProjectId: async (userId, projectId) => {
    try {
      const [rows] = await connection.query(
        "SELECT Project.* FROM Users INNER JOIN Project ON Users.idUsers = Project.Users_idUsers WHERE Users.idUsers = ? AND Project.idProject = ?",
        [userId, projectId]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = projectService;
