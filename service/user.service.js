const { get } = require("http");
const connection = require("../helpers/mysql-config");
const jwtMiddleware = require("../middleware/jwt-middleware");

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
};

module.exports = userService;
