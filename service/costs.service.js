const connection = require("../helpers/mysql-config");

const costService = {
  addCost: async (
    productionCost,
    customerPayment,
    handProcessTime,
    createdAt,
    Bots_idBots
  ) => {
    try {
      const sql = `
        INSERT INTO Costs (productionCost, customerPayment, handProcessTime, createdAt, Bots_idBots)
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [
        productionCost,
        customerPayment,
        handProcessTime,
        createdAt,
        Bots_idBots,
      ];
      const [result] = await connection.query(sql, values);
      return result;
    } catch (error) {
      console.error("Error adding cost:", error);
      throw new Error("Failed to add cost");
    }
  },

  getCostByBotId: async (Bots_idBots) => {
    try {
      const sql = `
        SELECT b.botName, 
               c.productionCost, 
               c.customerPayment, 
               c.handProcessTime,
               ((c.productionCost - c.customerPayment) / c.handProcessTime) AS calculatedCost
        FROM Bots b
        INNER JOIN Costs c ON b.idBots = c.Bots_idBots
        WHERE b.idBots = ?
      `;
      const values = [Bots_idBots];
      const [result] = await connection.query(sql, values);
      if (result.length > 0) {
        return result[0]; // Return the first result since bot IDs are unique and should only have one set of costs
      }
      return null; // Return null if no costs are found for the bot
    } catch (error) {
      console.error("Error retrieving cost by bot ID:", error);
      throw new Error("Failed to retrieve cost");
    }
  },

  calculateCosts: async (Bots_idBots, timeframe) => {
    try {
      let sql;
      switch (timeframe) {
        case "weekly":
          sql = `
            SELECT 
                DATE_FORMAT(createdAt, '%d-%b %H:%i') AS weekOfYear,
                AVG(productionCost) AS avgCost, 
                AVG(customerPayment) AS avgRevenue
            FROM Costs
            WHERE Bots_idBots = ? AND createdAt >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
            GROUP BY DATE_FORMAT(createdAt, '%Y-%m-%d')
            ORDER BY weekOfYear
          `;
          break;
        case "monthly":
          sql = `
            SELECT 
                DATE_FORMAT(DATE(createdAt), '%d-%b') AS month,
                AVG(productionCost) AS avgCost, 
                AVG(customerPayment) AS avgRevenue
            FROM Costs
            WHERE Bots_idBots = ? AND createdAt >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
            GROUP BY DATE_FORMAT(createdAt, '%Y-%m-%d')
            ORDER BY month
          `;
          break;
        case "yearly":
          sql = `
            SELECT 
                DATE_FORMAT(createdAt, '%Y') AS year,
                AVG(productionCost) AS avgCost, 
                AVG(customerPayment) AS avgRevenue
            FROM Costs
           WHERE Bots_idBots = ? AND createdAt >= DATE_SUB(NOW(), INTERVAL 5 YEAR)
           GROUP BY DATE_FORMAT(createdAt, '%Y') 
           ORDER BY createdAt
          `;
          break;
        default:
          throw new Error("Invalid timeframe specified");
      }

      const values = [Bots_idBots];
      const [result] = await connection.query(sql, values);
      return result;
    } catch (error) {
      console.error("Error calculating costs:", error);
      throw new Error("Failed to calculate costs");
    }
  },
};

module.exports = costService;
