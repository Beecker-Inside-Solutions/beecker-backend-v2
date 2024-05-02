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

  getBotsByProject: async (idProject) => {
    try {
      const [rows] = await connection.query(
        "SELECT Bots.*, Project.idProject, Project.projectName FROM Bots JOIN Project ON Bots.Project_idProject = Project.idProject WHERE Project.idProject = ?",
        [idProject]
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

  getBotExecutions: async (idBot, timeframe) => {
    let sql;
    switch (timeframe) {
      case "weekly":
        sql = `
            SELECT 
                DATE_FORMAT(executionStart, '%d-%b %H:%i') AS dayMonthTime,
                SUM(CASE WHEN executionStatus = 1 THEN 1 ELSE 0 END) AS successCount,
                SUM(CASE WHEN executionStatus = 0 THEN 1 ELSE 0 END) AS failureCount
            FROM Items
            WHERE Bots_idBots = ? AND executionStart >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
            GROUP BY DATE_FORMAT(executionStart, '%Y-%m-%d %H:%i')
            ORDER BY executionStart;
        `;
        break;
      case "monthly":
        sql = `
            SELECT 
              DATE_FORMAT(executionStart, '%d-%b') AS dayMonth,
              SUM(CASE WHEN executionStatus = 1 THEN 1 ELSE 0 END) AS successCount,
              SUM(CASE WHEN executionStatus = 0 THEN 1 ELSE 0 END) AS failureCount
            FROM Items
            WHERE Bots_idBots = ? AND executionStart >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
            GROUP BY DATE_FORMAT(executionStart, '%Y-%m-%d')
            ORDER BY executionStart;
          `;
        break;
      case "yearly":
        sql = `
          SELECT 
            DATE_FORMAT(executionStart, '%Y') AS year,
            SUM(CASE WHEN executionStatus = 1 THEN 1 ELSE 0 END) AS successCount,
            SUM(CASE WHEN executionStatus = 0 THEN 1 ELSE 0 END) AS failureCount
          FROM Items
          WHERE Bots_idBots = ? AND executionStart >= DATE_SUB(NOW(), INTERVAL 5 YEAR)
          GROUP BY DATE_FORMAT(executionStart, '%Y')
          ORDER BY executionStart;
        `;
        break;
      default:
        throw new Error("Invalid timeframe specified");
    }

    try {
      const [results] = await connection.query(sql, [idBot]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  calculateSuccessandFailRate: async (idBot, timeframe) => {
    let sql; // Declare `sql` variable to ensure it's scoped correctly
    switch (timeframe) {
      case "weekly":
        sql = `
            SELECT 
                DATE_FORMAT(executionStart, '%Y-%m-%d %H:%i') AS timeGroup,
                COUNT(*) AS totalExecutions,
                SUM(CASE WHEN executionStatus = 1 THEN 1 ELSE 0 END) AS successCount,
                SUM(CASE WHEN executionStatus = 0 THEN 1 ELSE 0 END) AS failureCount
            FROM Items
            WHERE Bots_idBots = ? AND executionStart >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
            GROUP BY timeGroup
            ORDER BY executionStart;
        `;
        break;
      case "monthly":
        sql = `
            SELECT 
                DATE_FORMAT(executionStart, '%Y-%m') AS timeGroup,
                COUNT(*) AS totalExecutions,
                SUM(CASE WHEN executionStatus = 1 THEN 1 ELSE 0 END) AS successCount,
                SUM(CASE WHEN executionStatus = 0 THEN 1 ELSE 0 END) AS failureCount
            FROM Items
            WHERE Bots_idBots = ? AND executionStart >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
            GROUP BY timeGroup
            ORDER BY executionStart;
        `;
        break;
      case "yearly":
        sql = `
            SELECT 
                DATE_FORMAT(executionStart, '%Y') AS timeGroup,
                COUNT(*) AS totalExecutions,
                SUM(CASE WHEN executionStatus = 1 THEN 1 ELSE 0 END) AS successCount,
                SUM(CASE WHEN executionStatus = 0 THEN 1 ELSE 0 END) AS failureCount
            FROM Items
            WHERE Bots_idBots = ? AND executionStart >= DATE_SUB(NOW(), INTERVAL 5 YEAR)
            GROUP BY timeGroup
            ORDER BY executionStart;
        `;
        break;
      default:
        throw new Error("Invalid timeframe specified");
    }
    try {
      const [results] = await connection.query(sql, [idBot]);
      return results.map((row) => ({
        ...row,
        successRate:
          row.totalExecutions > 0
            ? (row.successCount / row.totalExecutions) * 100
            : 0,
        failureRate:
          row.totalExecutions > 0
            ? (row.failureCount / row.totalExecutions) * 100
            : 0,
      }));
    } catch (error) {
      throw error;
    }
  },

  calculateRoi: async (idBot, timeframe) => {
    let sql;
    switch (timeframe) {
      case "weekly":
        sql = `
                SELECT 
                    DATE_FORMAT(DATE(createdAt), '%X-%V') AS weekOfYear,
                    SUM(productionCost) AS totalCost, 
                    SUM(customerPayment) AS totalRevenue
                FROM Costs
                WHERE Bots_idBots = ? AND createdAt >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
                GROUP BY weekOfYear
            `;
        break;
      case "monthly":
        sql = `
                SELECT 
                    DATE_FORMAT(DATE(createdAt), '%Y-%m') AS month,
                    SUM(productionCost) AS totalCost, 
                    SUM(customerPayment) AS totalRevenue
                FROM Costs
                WHERE Bots_idBots = ? AND createdAt >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
                GROUP BY month
            `;
        break;
      case "yearly":
        sql = `
                  SELECT 
                      YEAR(DATE(createdAt)) AS year,
                      SUM(productionCost) AS totalCost, 
                      SUM(customerPayment) AS totalRevenue
                  FROM Costs
                  WHERE Bots_idBots = ? AND YEAR(DATE(createdAt)) = YEAR(CURDATE())
                  GROUP BY year
              `;
        break;

      default:
        throw new Error("Invalid timeframe specified");
    }
    try {
      const [results] = await connection.query(sql, [idBot]);
      if (results.length === 0) {
        return {
          message: "No financial data available for the specified timeframe",
        };
      }

      return results.map((result) => {
        const netProfit = result.totalRevenue - result.totalCost;
        const roi =
          result.totalCost > 0 ? (netProfit / result.totalCost) * 100 : 0;
        return {
          timeGroup: result.weekOfYear || result.month || result.year,
          totalCost: result.totalCost,
          totalRevenue: result.totalRevenue,
          netProfit,
          roi,
        };
      });
    } catch (error) {
      console.error("Failed to calculate ROI:", error);
      throw new Error(`Error when calculating ROI: ${error.message}`);
    }
  },
  getSavedHours: async (idBot, timeframe) => {
    let sql;
    const manualMultiplier = 3; // Assume manual tasks take 3 times longer than automated
    switch (timeframe) {
      case "weekly":
        sql = `
          SELECT 
            DATE_FORMAT(executionStart, '%Y-%u') AS week,
            SUM(TIMESTAMPDIFF(SECOND, executionStart, executionFinish) / 3600.0) AS automatedHours,
            SUM(TIMESTAMPDIFF(SECOND, executionStart, executionFinish) / 3600.0 * ${manualMultiplier}) AS manualHours
          FROM Items
          WHERE Bots_idBots = ? AND executionStart >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
          GROUP BY week
        `;
        break;
      case "monthly":
        sql = `
          SELECT 
            DATE_FORMAT(executionStart, '%Y-%m') AS month,
            SUM(TIMESTAMPDIFF(SECOND, executionStart, executionFinish) / 3600.0) AS automatedHours,
            SUM(TIMESTAMPDIFF(SECOND, executionStart, executionFinish) / 3600.0 * ${manualMultiplier}) AS manualHours
          FROM Items
          WHERE Bots_idBots = ? AND executionStart >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
          GROUP BY month
        `;
        break;
      case "yearly":
        sql = `
          SELECT 
            YEAR(executionStart) AS year,
            SUM(TIMESTAMPDIFF(SECOND, executionStart, executionFinish) / 3600.0) AS automatedHours,
            SUM(TIMESTAMPDIFF(SECOND, executionStart, executionFinish) / 3600.0 * ${manualMultiplier}) AS manualHours
          FROM Items
          WHERE Bots_idBots = ? AND executionStart >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
          GROUP BY year
        `;
        break;
      default:
        throw new Error("Invalid timeframe specified");
    }

    try {
      const [results] = await connection.query(sql, [idBot]);
      return results.map((result) => {
        const automatedHours = Number(result.automatedHours || 0);
        const manualHours = Number(result.manualHours || 0);
        const savedHours = manualHours - automatedHours;
        const savedPercentage =
          manualHours > 0 ? (savedHours / manualHours) * 100 : 0;

        return {
          timeGroup: result.week || result.month || result.year,
          automatedHours: automatedHours,
          manualHours: manualHours,
          savedHours: savedHours,
          savedPercentage: savedPercentage,
        };
      });
    } catch (error) {
      console.error("Failed to calculate saved hours:", error);
      throw error;
    }
  },
};

module.exports = botService;
