const connection = require("../helpers/mysql-config");

const itemService = {
  getItems: async () => {
    try {
      const [rows] = await connection.query("SELECT * FROM Items");
      return rows;
    } catch (error) {
      throw error;
    }
  },

  addItem: async (
    executionStart,
    executionFinish,
    executionDescription,
    executionStatus,
    botId
  ) => {
    try {
      const sql = `
        INSERT INTO Items (executionStart, executionFinish, executionDescription, executionStatus, Bots_idBots)
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [
        executionStart,
        executionFinish,
        executionDescription,
        executionStatus,
        botId,
      ];
      const [result] = await connection.query(sql, values);
      return result;
    } catch (error) {
      throw error;
    }
  },

  calculateExecutionTime: async (botId) => {
    try {
      // Updated SQL to include a JOIN with the Bots table to get the botName
      const sql = `
        SELECT i.executionStart, i.executionFinish, b.botName 
        FROM Items i
        JOIN Bots b ON i.Bots_idBots = b.idBots
        WHERE b.idBots = ?
      `;
      const [items] = await connection.query(sql, [botId]);

      // Initialize counters
      let totalMinutes = 0;
      let totalHours = 0;
      let totalSeconds = 0;
      let botName = items.length > 0 ? items[0].botName : null; // Assumes all items will have the same botName

      // Calculate the time differences
      items.forEach((item) => {
        if (item.executionFinish && item.executionStart) {
          const start = new Date(item.executionStart);
          const finish = new Date(item.executionFinish);
          const diff = finish - start;
          totalHours += diff / 3600000; // Total hours as a fraction
          totalMinutes += diff / 60000; // Total minutes as a fraction
          totalSeconds += diff / 1000; // Total seconds as a fraction
        }
      });

      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.floor(totalMinutes % 60);

      return {
        botName, // Include the bot name in the returned object
        totalHours: totalHours,
        totalMinutes: totalMinutes,
        totalSeconds: totalSeconds,
        hours,
        minutes,
      };
    } catch (error) {
      throw error;
    }
  },

  calculateHoursSaved: async (botId) => {
    try {
      // SQL to fetch executionStart and executionFinish for all items of a specific bot, ordered by executionStart
      const sql = `
        SELECT idItem, executionStart, executionFinish
        FROM Items
        WHERE Bots_idBots = ?
        ORDER BY executionStart ASC
      `;
      const [items] = await connection.query(sql, [botId]);

      let results = [];
      let previousDuration = 0; // Variable to store the duration of the previous task

      items.forEach((item, index) => {
        if (item.executionFinish && item.executionStart) {
          const start = new Date(item.executionStart);
          const finish = new Date(item.executionFinish);
          const duration = (finish - start) / 3600000; // Duration in hours

          if (index > 0) {
            // Skip the first item since there's no previous item to compare with
            const hoursSaved = previousDuration - duration; // Calculate hours saved (could be negative if more time was spent)
            results.push({
              itemId: item.idItem,
              hoursSaved: hoursSaved, // Keeping two decimals for precision
            });
          }
          // Update previousDuration for the next iteration
          previousDuration = duration;
        }
      });

      return results;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = itemService;
