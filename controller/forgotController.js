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

  resetPassword: async (req, res) => {
    try {
      const { password, token } = req.body;
      console.log(`Reset password endpoint hit with token: ${token}`);

      if (!password || !token) {
        console.error("Missing password or token in request body");
        return res
          .status(400)
          .json({ message: "Password and token are required" });
      }

      // Call the resetPassword method of the forgotService
      await forgotService.resetPassword(password, token);
      res.status(200).json({ message: "Password updated" });
    } catch (error) {
      console.error("Error in resetPassword controller:", error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = forgotController;
