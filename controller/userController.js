const userService = require("../service/user.service");
const jwtMiddleware = require("../middleware/jwt-middleware"); // Import jwtMiddleware for token generation

const userController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const response = await userService.validateUser(email, password);

      const token = response.token;

      res.status(200).json({ token: token, message: response.message });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await userService.getUsers();

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
