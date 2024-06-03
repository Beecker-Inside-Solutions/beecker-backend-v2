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

  costsChart: async (req, res) => {
    try {
      const { botId } = req.params;
      const { timeframe } = req.body; // Assuming timeframe is provided in the body
      if (!["weekly", "monthly", "yearly"].includes(timeframe)) {
        return res.status(400).json({
          message:
            "Invalid timeframe specified. Please choose 'weekly', 'monthly', or 'yearly'.",
          status_code: 0,
        });
      }

      const result = await costService.calculateCosts(botId, timeframe);

      const labelsCosts = [];
      const labelsRevenue = [];
      const dataCosts = [];
      const dataRevenue = [];

      result.forEach((element) => {
        let label;
        if (timeframe === "weekly") {
          label = element.weekOfYear; // assuming weekOfYear is for 'weekly'
        } else if (timeframe === "monthly") {
          label = element.month; // assuming month is for 'monthly'
        } else if (timeframe === "yearly") {
          label = element.year; // assuming year is for 'yearly'
        }

        labelsCosts.push(label || "No Date");
        dataCosts.push(parseInt(element.avgCost, 10));
        labelsRevenue.push(label || "No Date");
        dataRevenue.push(parseInt(element.avgRevenue, 10));
      });

      res.status(200).json({
        dataCosts,
        dataRevenue,
        labelsCosts,
        labelsRevenue,
        message: "SUCCESS",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = costsController;
