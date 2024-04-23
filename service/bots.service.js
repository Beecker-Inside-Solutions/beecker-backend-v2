const connection = require("../helpers/mysql-config");

const botService = {
  getBots: async () => {
    try {
      const [rows] = await connection.query("SELECT * FROM Bots");
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getBot: async (idBot) => {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM Bots WHERE idBots = ?",
        [idBot]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  addBot: async (botName, isExecuting, Project_idProject) => {
    try {
      const [rows] = await connection.query(
        "INSERT INTO Bots (botName, isExecuting, Project_idProject) VALUES (?, ?, ?)",
        [botName, isExecuting, Project_idProject]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  updateBot: async (idBot, botName, isExecuting) => {
    try {
      const [rows] = await connection.query(
        "UPDATE Bots SET botName = ?, isExecuting = ? WHERE idBots = ?",
        [botName, isExecuting, idBot]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  deleteBot: async (idBot) => {
    try {
      const [rows] = await connection.query(
        "DELETE FROM Bots WHERE idBots = ?",
        [idBot]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getBotsByProject: async (idProject) => {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM Bots WHERE Project_idProject = ?",
        [idProject]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getBotsByUser: async (idUsers) => {
    try {
      const [rows] = await connection.query(
        `SELECT Bots.* FROM Bots
         JOIN Project ON Bots.Project_idProject = Project.idProject
         WHERE Project.Users_idUsers = ?`,
        [idUsers]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  setInactive: async (idBot) => {
    try {
      const [rows] = await connection.query(
        "UPDATE Bots SET isExecuting = 0 WHERE idBots = ?",
        [idBot]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = botService;
