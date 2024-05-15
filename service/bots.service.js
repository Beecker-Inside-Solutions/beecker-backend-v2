const connection = require("../helpers/mysql-config");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

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
    let sql;
    switch (timeframe) {
      case "weekly":
        sql = `
          SELECT 
            DATE_FORMAT(executionStart, '%Y-%u') AS timeGroup,
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
          WHERE Bots_idBots = ? AND executionStart >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
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
          WHERE Bots_idBots = ? AND executionStart >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
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
      console.error("Failed to calculate success and failure rates:", error);
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

  calculateAverageSuccess: async (idBot, timeframe) => {
    let sql;
    switch (timeframe) {
      case "weekly":
        sql = `
                SELECT 
                    DATE_FORMAT(executionStart, '%X-%V') AS weekYear,
                    COUNT(*) AS totalExecutions,
                    SUM(CASE WHEN executionStatus = 1 THEN 1 ELSE 0 END) AS successCount
                FROM Items
                WHERE Bots_idBots = ? AND executionStart >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
                GROUP BY weekYear
                ORDER BY executionStart;
            `;
        break;
      case "monthly":
        sql = `
                SELECT 
                    DATE_FORMAT(executionStart, '%Y-%m') AS month,
                    COUNT(*) AS totalExecutions,
                    SUM(CASE WHEN executionStatus = 1 THEN 1 ELSE 0 END) AS successCount
                FROM Items
                WHERE Bots_idBots = ? AND executionStart >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
                GROUP BY month
                ORDER BY executionStart;
            `;
        break;
      case "yearly":
        sql = `
                SELECT 
                    DATE_FORMAT(executionStart, '%Y') AS year,
                    COUNT(*) AS totalExecutions,
                    SUM(CASE WHEN executionStatus = 1 THEN 1 ELSE 0 END) AS successCount
                FROM Items
                WHERE Bots_idBots = ? AND executionStart >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
                GROUP BY year
                ORDER BY executionStart;
            `;
        break;
      default:
        throw new Error(
          "Invalid timeframe specified. Choose 'weekly', 'monthly', or 'yearly'."
        );
    }

    try {
      const [results] = await connection.query(sql, [idBot]);
      if (results.length === 0) {
        return {
          message:
            "No execution data available for this bot within the specified timeframe.",
          data: [],
          status_code: 0,
        };
      }

      return results.map((result) => {
        const totalExecutions = parseInt(result.totalExecutions, 10); // Ensure totalExecutions is an integer
        const successCount = parseInt(result.successCount, 10); // Convert successCount to integer
        const averageSuccessRate =
          totalExecutions > 0 ? (successCount / totalExecutions) * 100 : 0;

        return {
          timeGroup: result.weekYear || result.month || result.year,
          totalExecutions: totalExecutions,
          successCount: successCount,
          averageSuccessRate: averageSuccessRate, // Optionally round to 2 decimal places
        };
      });
    } catch (error) {
      console.error("Failed to calculate average success rate:", error);
      throw error;
    }
  },

  exportBotStatistics: async (idBot, timeframe) => {
    try {
      const successAndFailRate = await botService.calculateSuccessandFailRate(idBot, timeframe);
      const botExecutions = await botService.getBotExecutions(idBot, timeframe);
      const savedHours = await botService.getSavedHours(idBot, timeframe);
      const roi = await botService.calculateRoi(idBot, timeframe);
      const averageSuccess = await botService.calculateAverageSuccess(idBot, timeframe);
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Bot Statistics");
  
      worksheet.columns = [
        { header: "Time Group", key: "timeGroup", width: 15 },
        { header: "Total Executions", key: "totalExecutions", width: 20 },
        { header: "Success Count", key: "successCount", width: 15 },
        { header: "Failure Count", key: "failureCount", width: 15 },
        { header: "Success Rate (%)", key: "successRate", width: 20 },
        { header: "Failure Rate (%)", key: "failureRate", width: 20 },
        { header: "Automated Hours", key: "automatedHours", width: 20 },
        { header: "Manual Hours", key: "manualHours", width: 20 },
        { header: "Saved Hours", key: "savedHours", width: 15 },
        { header: "Saved Percentage (%)", key: "savedPercentage", width: 20 },
        { header: "Total Cost", key: "totalCost", width: 15 },
        { header: "Total Revenue", key: "totalRevenue", width: 15 },
        { header: "Net Profit", key: "netProfit", width: 15 },
        { header: "ROI (%)", key: "roi", width: 10 },
        { header: "Average Success Rate (%)", key: "averageSuccessRate", width: 25 },
      ];
  
      const mergedData = successAndFailRate.map((data, index) => ({
        ...data,
        ...botExecutions[index],
        ...savedHours[index],
        ...roi[index],
        ...averageSuccess[index],
      }));
  
      worksheet.addRows(mergedData);
  
      const buffer = await workbook.xlsx.writeBuffer();
  
      return {
        message: "Bot statistics exported successfully",
        buffer,
      };
    } catch (error) {
      console.error("Failed to export bot statistics:", error);
      throw error;
    }
  },
};
module.exports = botService;
