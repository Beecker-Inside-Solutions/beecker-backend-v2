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
      console.log("params in controller", req.params);
      console.log(bots);
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
};

module.exports = botsController;
