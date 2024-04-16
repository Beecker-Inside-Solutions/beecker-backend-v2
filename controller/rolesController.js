const rolesService = require("../service/roles.service");

const rolesController = {
  getRoles: async (req, res) => {
    try {
      const roles = await rolesService.getRoles();

      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addRole: async (req, res) => {
    try {
      const { userRole, isAdmin, isBeecker } = req.body;
      const response = await rolesService.addRole(userRole, isAdmin, isBeecker);

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateRole: async (req, res) => {
    try {
      const { idRole } = req.params;
      const { userRole, isAdmin, isBeecker } = req.body;
      const response = await rolesService.updateRole(
        idRole,
        userRole,
        isAdmin,
        isBeecker
      );

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteRole: async (req, res) => {
    try {
      const { idRole } = req.params;
      const response = await rolesService.deleteRole(idRole);

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
