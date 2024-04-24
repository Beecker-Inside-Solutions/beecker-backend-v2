const itemService = require("../service/items.service");

const itemsController = {
  getItems: async (req, res) => {
    try {
      const items = await itemService.getItems();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addItem: async (req, res) => {
    try {
      const {
        executionStart,
        executionFinish,
        executionDescription,
        executionStatus,
        botId,
      } = req.body;
      await itemService.addItem(
        executionStart,
        executionFinish,
        executionDescription,
        executionStatus,
        botId
      );
      res.status(200).json({ message: "Item added successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  calculateExecutionTime: async (req, res) => {
    try {
      const { botId } = req.params;
      const executionTime = await itemService.calculateExecutionTime(botId);
      res.status(200).json(executionTime);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  calculateHoursSaved: async (req, res) => {
    try {
      const { botId } = req.params;
      const hoursSaved = await itemService.calculateHoursSaved(botId);
      res.status(200).json(hoursSaved);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = itemsController;
