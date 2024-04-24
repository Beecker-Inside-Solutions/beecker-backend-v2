const connection = require("../helpers/mysql-config");

const costService = {
  addCost: async (
    productionCost,
    customerPayment,
    handProcessTime,
    Bots_idBots
  ) => {
    try {
      const sql = `
          INSERT INTO Costs (productionCost, customerPayment, handProcessTime, Bots_idBots)
          VALUES (?, ?, ?, ?)
        `;
      const values = [
        productionCost,
        customerPayment,
        handProcessTime,
        Bots_idBots,
      ];
      const [result] = await connection.query(sql, values);
      return result;
    } catch (error) {
      throw error;
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
      throw error;
    }
  },
};

module.exports = costService;
