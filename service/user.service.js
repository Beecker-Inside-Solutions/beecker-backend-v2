const connection = require("../helpers/mysql-config");
const jwtMiddleware = require("../middleware/jwt-middleware");

const userService = {
  validateUser: async (email, password) => {
    try {
      const [rows] = await connection.query(
        "SELECT idUsers, Roles_idRole FROM Users WHERE email = ? AND password = SHA2(?,224)",
        [email, password]
      );

      if (rows.length > 0) {
        const user = rows[0];
        const isAdmin = user.Roles_idRole === 1;
        const isBeecker = user.Roles_idRole === 2;

        let token;
        if (isAdmin) {
          token = jwtMiddleware.generateAdminToken(user.idUsers);
        } else if (isBeecker) {
          // token = jwtMiddleware.generateBeeckerToken(user.idUsers);
          token = jwtMiddleware.generateToken(user.idUsers);
        } else {
          token = jwtMiddleware.generateToken(user.idUsers);
        }

        return { token: token, message: "Login successful" };
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      throw error;
    }
  },

  getUsers: async () => {
    try {
      const [rows] = await connection.query("SELECT * FROM Users");

      return rows;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (idUsers) => {
    try {
      const [rows] = await connection.query(
        "DELETE FROM Users WHERE idUsers = ?",
        [idUsers]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  getUserTypes: async () => {
    try {
      const [rows] = await connection.query("SELECT * FROM UserTypes");

      return rows;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (idUsers) => {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM Users WHERE idUsers = ?",
        [idUsers]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  registerUser: async (
    email,
    password,
    name,
    lastName,
    secondLastName,
    dateOfBirth,
    userTypeId
  ) => {
    try {
      const sql =
        "INSERT INTO Users (email, password, name, lastName, secondLastName, dateOfBirth, Roles_idRole) VALUES (?, SHA2(?,224), ?, ?, ?, ?, ?)";
      const [rows] = await connection.query(sql, [
        email,
        password,
        name,
        lastName,
        secondLastName,
        dateOfBirth,
        userTypeId,
      ]);
      console.log("email", email);
      console.log(
        "password, name, lastName, secondLastName, dateOfBirth, userTypeId",
        password,
        name,
        lastName,
        secondLastName,
        dateOfBirth,
        userTypeId
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  updateUserPermissions: async (idUsers, email, userTypeId) => {
    try {
      const [rows] = await connection.query(
        "UPDATE Users SET email = ?, Roles_idRole = ? WHERE idUsers = ?",
        [email, userTypeId, idUsers]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = userService;
