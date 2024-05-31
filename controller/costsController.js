const costService = require("../service/costs.service");

const costsController = {
  addCost: async (req, res) => {
    try {
      const {
        productionCost,
        customerPayment,
        handProcessTime,
        createdAt,
        Bots_idBots,
      } = req.body;
      await costService.addCost(
        productionCost,
        customerPayment,
        handProcessTime,
        createdAt,
        Bots_idBots
      );
      res.status(200).json({ message: "Cost added successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCostByBotId: async (req, res) => {
    try {
      const { botId } = req.params;
      const costs = await costService.getCostByBotId(botId);
      res.status(200).json(costs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  calculateCosts: async (req, res) => {
    try {
      const { botId } = req.params;
      const { timeframe } = req.body; // Assuming timeframe is provided in the body
      if (!["weekly", "monthly", "yearly"].includes(timeframe)) {
        return res.status(400).json({ message: "Invalid timeframe specified" });
      }
      const result = await costService.calculateCosts(botId, timeframe);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = costsController;
