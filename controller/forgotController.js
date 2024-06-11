const forgotService = require("../service/forgot.service");

const forgotController = {
  forgotPassword: async (req, res) => {
    try {
      const { email, languageType } = req.body;
      console.log(
        `Forgot password endpoint hit with email: ${email}, languageType: ${languageType}`
      );

      if (!email || !languageType) {
        console.error("Missing email or languageType in request body");
        return res
          .status(400)
          .json({ message: "Email and language type are required" });
      }

      await forgotService.forgotPassword(email, languageType);
      res.status(200).json({ message: "Email sent" });
    } catch (error) {
      console.error("Error in forgotPassword controller:", error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = forgotController;
