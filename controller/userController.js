const userService = require("../service/user.service");

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
      const response = await userService.deleteUser(idUsers);

      res.status(200).json(response);
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
      const {
        email,
        password,
        name,
        lastName,
        secondLastName,
        dateOfBirth,
        idUserTypes,
      } = req.body;
      const response = await userService.registerUser(
        email,
        password,
        idUserTypes,
        name,
        lastName,
        secondLastName,
        dateOfBirth
      );

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateUserPermissions: async (req, res) => {
    try {
      const { idUsers } = req.params;
      const { idUserTypes } = req.body;
      const response = await userService.updateUserPermissions(
        idUsers,
        idUserTypes
      );

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
