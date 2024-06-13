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
    console.log("Request body:", req.body); // Add this line to log the request body
    try {
      const { password, token, userId } = req.body;
      console.log(`Reset password endpoint hit with token: ${token}`);

      if (!password || !token || !userId) {
        console.error("Missing password, token, or userId in request body");
        return res
          .status(400)
          .json({ message: "Password, token, and userId are required" });
      }

      // Parse userId as integer
      const idUser = parseInt(userId, 10);
      console.log(`Parsed userId: ${idUser}`);

      await forgotService.resetPassword(password, token, idUser);
      res.status(200).json({ message: "Password updated" });
    } catch (error) {
      console.error("Error in resetPassword controller:", error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = forgotController;
