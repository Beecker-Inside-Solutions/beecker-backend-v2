const userService = require("../service/user.service");

const userController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const response = await userService.validateUser(email, password);
      const token = response.token;

      res.status(200).json({
        token: token,
        message: response.message,
        userId: response.userId,
      });
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

  getUserById: async (req, res) => {
    try {
      const { idUsers } = req.params;
      const user = await userService.getUserById(idUsers);

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { idUsers } = req.params;
      await userService.deleteUser(idUsers);
      res.status(200).json({ message: "User deleted", userId: idUsers });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUserTypes: async (req, res) => {
    try {
      const userTypes = await userService.getUserTypes();

      res.status(200).json(userTypes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  registerUser: async (req, res) => {
    try {
      const { email, password, name, lastName, dateOfBirth, userTypeId } =
        req.body;
      const response = await userService.registerUser(
        email,
        password,
        name,
        lastName,
        dateOfBirth,
        userTypeId
      );

      res.status(200).json("User registered successfully");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateUserPermissions: async (req, res) => {
    try {
      const { idUsers } = req.params;
      const { email, userTypeId } = req.body; // Assuming email is included in the request body
      await userService.updateUserPermissions(idUsers, email, userTypeId);

      res.status(200).json({
        message: "User permissions updated",
        userId: idUsers,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
