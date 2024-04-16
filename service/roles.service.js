const connection = require("../helpers/mysql-config");

const rolesService = {
  getRoles: async () => {
    try {
      const [rows] = await connection.query("SELECT * FROM Roles");

      return rows;
    } catch (error) {
      throw error;
    }
  },

  addRole: async (userRole, isAdmin, isBeecker) => {
    try {
      const [rows] = await connection.query(
        "INSERT INTO Roles (userRole, isAdmin, isBeecker) VALUES (?, ?, ?)",
        [userRole, isAdmin, isBeecker]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  updateRole: async (idRole, userRole, isAdmin, isBeecker) => {
    try {
      const [rows] = await connection.query(
        "UPDATE Roles SET userRole = ?, isAdmin = ?, isBeecker = ? WHERE idRole = ?",
        [userRole, isAdmin, isBeecker, idRole]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  deleteRole: async (idRole) => {
    try {
      const [rows] = await connection.query(
        "DELETE FROM Roles WHERE idRole = ?",
        [idRole]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = rolesService;
