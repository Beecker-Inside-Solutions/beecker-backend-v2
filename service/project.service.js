const connection = require("../helpers/mysql-config");

const projectService = {
  getProjects: async () => {
    try {
      const [rows] = await connection.query("SELECT * FROM Project");

      return rows;
    } catch (error) {
      throw error;
    }
  },
  getProject: async (idProject) => {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM Project WHERE idProject = ?",
        [idProject]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },
  addProject: async (projectName, projectDescription, idUsers) => {
    try {
      const [rows] = await connection.query(
        "INSERT INTO Project (projectName, projectDescription, Users_idUsers) VALUES (?, ?, ?)",
        [projectName, projectDescription, idUsers]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  updateProject: async (idProject, projectName, projectDescription) => {
    try {
      const [rows] = await connection.query(
        "UPDATE Project SET projectName = ?, projectDescription = ? WHERE idProject = ?",
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
        "DELETE FROM Project WHERE idProject = ?",
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

  getProjectsAndBotsByUser: async (idUsers) => {
    try {
      const [projects] = await connection.query(
        `
        SELECT 
          Project.idProject,
          Project.projectName,
          Project.projectDescription,
          Bots.idBots,
          Bots.botName,
          Bots.isExecuting
        FROM 
          Project
        LEFT JOIN Bots ON Project.idProject = Bots.Project_idProject
        WHERE 
          Project.Users_idUsers = ?
      `,
        [idUsers]
      );
      // Use a map to accumulate bots under their respective projects
      const projectsMap = {};
      projects.forEach((project) => {
        // If the project hasn't been added to the map, add it
        if (!projectsMap[project.idProject]) {
          projectsMap[project.idProject] = {
            idProject: project.idProject,
            projectName: project.projectName,
            projectDescription: project.projectDescription,
            bots: [],
          };
        }
        // Add the bot to the project if it exists
        if (project.idBots) {
          projectsMap[project.idProject].bots.push({
            idBots: project.idBots,
            botName: project.botName,
            isExecuting: project.isExecuting,
          });
        }
      });

      // Convert the map to an array of projects with bots
      return Object.values(projectsMap);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = projectService;
