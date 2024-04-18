const connection = require("../helpers/mysql-config");
const { get } = require("../routes/user");

const notificationService = {
  getNotifications: async () => {
    try {
      const [rows] = await connection.query("SELECT * FROM Notifications");

      return rows;
    } catch (error) {
      throw error;
    }
  },
  getNotificationById: async (idNotifications) => {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM Notifications WHERE idNotifications = ?",
        [idNotifications]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },
  deleteNotification: async (idNotifications) => {
    try {
      const [rows] = await connection.query(
        "DELETE FROM Notifications WHERE idNotifications = ?",
        [idNotifications]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },
  getNotificationFromUser: async (idUsers) => {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM Notifications WHERE Users_idUsers = ?",
        [idUsers]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  getNotificationByIdAndUserId: async (idNotifications, idUsers) => {
    try {
      const [rows] = await connection.query(
        "SELECT * FROM Notifications WHERE idNotifications = ? AND Users_idUsers = ?",
        [idNotifications, idUsers]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  addNotification: async (name, description, isActive, Users_idUsers) => {
    try {
      const [rows] = await connection.query(
        "INSERT INTO Notifications (name, description, isActive, Users_idUsers) VALUES (?, ?, ?, ?)",
        [name, description, isActive, Users_idUsers]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = notificationService;
