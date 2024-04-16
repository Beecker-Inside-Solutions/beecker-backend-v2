const connection = require("../helpers/mysql-config");
const jwtMiddleware = require("../middleware/jwt-middleware");
const { use } = require("../routes/user");

const userService = {
  validateUser: async (email, password) => {
    try {
      const [rows] = await connection.query(
        "SELECT idUsers, isAdmin FROM Users WHERE email = ? AND password = SHA2(?,224)",
        [email, password]
      );

      if (rows.length > 0) {
        const user = rows[0];
        const isAdmin = user.isAdmin === 1;

        let token;
        if (isAdmin) {
          token = jwtMiddleware.generateAdminToken(user.idUsers);
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
    //idUsers,
    email,
    password,
    name,
    lastName,
    secondLastName,
    dateOfBirth,
    userTypeId = 0
  ) => {
    try {
      const [rows] = await connection.query(
        "INSERT INTO Users (email,password,name,lastName,secondLastName,dateOfBirth,UserTypes_idUserTypes) VALUES (?,SHA2(?,224),?,?,?,?,?)"[ //WHERE idUsers = ?",
          (email,
          password,
          name,
          lastName,
          secondLastName,
          dateOfBirth,
          userTypeId) //,
          // idUsers,
        ]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  updateUserPermissions: async (idUsers, email, userTypeId) => {
    try {
      const [rows] = await connection.query(
        "UPDATE Users SET email = ?, UserTypes_idUserTypes = ? WHERE idUsers = ?",
        [email, userTypeId, idUsers]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = userService;
