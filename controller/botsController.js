const botService = require("../service/bots.service");

const botsController = {
  getBots: async (req, res) => {
    try {
      const bots = await botService.getBots();
      res.status(200).json(bots);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getBot: async (req, res) => {
    try {
      const { idBots } = req.params;
      const bot = await botService.getBot(idBots);
      res.status(200).json(bot);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addBot: async (req, res) => {
    try {
      const { botName, isExecuting, Project_idProject } = req.body;
      await botService.addBot(botName, isExecuting, Project_idProject);
      res.status(200).json({ message: "Bot added successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateBot: async (req, res) => {
    try {
      const { idBots } = req.params;
      const { botName, isExecuting } = req.body;
      await botService.updateBot(idBots, botName, isExecuting);
      res.status(200).json({ message: "Bot updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteBot: async (req, res) => {
    try {
      const { idBots } = req.params;
      await botService.deleteBot(idBots);
      res.status(200).json({ message: "Bot deleted successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getBotsByProject: async (req, res) => {
    try {
      const { idProject } = req.params;
      const bots = await botService.getBotsByProject(idProject);
      res.status(200).json(bots);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getBotsByUser: async (req, res) => {
    try {
      const { idUser } = req.params;
      const bots = await botService.getBotsByUser(idUser);
      res.status(200).json(bots);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getBotsByProject: async (req, res) => {
    try {
      const { idProject } = req.params;
      const bots = await botService.getBotsByProject(idProject);
      res.status(200).json(bots);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  setInactive: async (req, res) => {
    try {
      const { idBots } = req.params;
      await botService.setInactive(idBots);
      res.status(200).json({ message: "Bot set to inactive!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getBotExecutions: async (req, res) => {
    try {
      const { idBot } = req.params;
      const { timeframe } = req.body;

      if (!["weekly", "monthly", "yearly"].includes(timeframe)) {
        return res.status(400).json({
          message:
            "Invalid timeframe specified. Please choose 'weekly', 'monthly', or 'yearly'.",
          status_code: 0,
        });
      }

      const executionData = await botService.getBotExecutions(idBot, timeframe);

      const labelsSuccess = [];
      const dataSuccess = [];
      const labelsFailed = [];
      const dataFailed = [];

      executionData.forEach((data) => {
        let label;
        if (timeframe === "weekly") {
          label = data.dayMonthTime; // assuming dayMonthTime is for 'weekly'
        } else if (timeframe === "monthly") {
          label = data.dayMonth; // assuming dayMonth is for 'monthly'
        } else if (timeframe === "yearly") {
          label = data.year; // assuming year is for 'yearly'
        }

        labelsSuccess.push(label || "No Date");
        dataSuccess.push(parseInt(data.successCount, 10)); // Convert to integer
        labelsFailed.push(label || "No Date");
        dataFailed.push(parseInt(data.failureCount, 10)); // Convert to integer
      });

      res.json({
        message: "SUCCESS",
        labelsSuccess: labelsSuccess,
        dataSuccess: dataSuccess,
        labelsFailed: labelsFailed,
        dataFailed: dataFailed,
        status_code: 1,
      });
    } catch (error) {
      console.error("Execution data fetch error:", error);
      res.status(500).json({
        message: error.message,
        status_code: 0,
      });
    }
  },

  getSuccessAndFailRate: async (req, res) => {
    try {
      const { idBot } = req.params;
      const { timeframe } = req.body;

      if (!["weekly", "monthly", "yearly"].includes(timeframe)) {
        return res.status(400).json({
          message:
            "Invalid timeframe specified. Please choose 'weekly', 'monthly', or 'yearly'.",
          status_code: 0,
        });
      }

      const rates = await botService.calculateSuccessandFailRate(
        idBot,
        timeframe
      );
      res.status(200).json({
        message: "Success and failure rates retrieved successfully.",
        data: rates,
        status_code: 1,
      });
    } catch (error) {
      console.error("Error retrieving success and failure rates:", error);
      res.status(500).json({
        message: error.message,
        status_code: 0,
      });
    }
  },

  calculateRoi: async (req, res) => {
    try {
      const { idBot } = req.params;
      const roi = await botService.calculateRoi(idBot);
      res.status(200).json({
        message: "ROI calculated successfully.",
        data: roi,
        status_code: 1,
      });
    } catch (error) {
      console.error("Error calculating ROI:", error);
      res.status(500).json({
        message: error.message,
        status_code: 0,
      });
    }
  },
};

module.exports = botsController;
