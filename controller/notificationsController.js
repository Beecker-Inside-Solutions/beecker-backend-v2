const notificationService = require("../service/notification.service");

const notificationController = {
  getNotifications: async (req, res) => {
    try {
      const notifications = await notificationService.getNotifications();
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getNotificationById: async (req, res) => {
    try {
      const { idNotifications } = req.params;
      const notification = await notificationService.getNotificationById(
        idNotifications
      );
      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteNotification: async (req, res) => {
    try {
      const { idNotifications } = req.params;
      const response = await notificationService.deleteNotification(
        idNotifications
      );
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getNotificationFromUser: async (req, res) => {
    try {
      const { idUsers } = req.params;
      const notifications = await notificationService.getNotificationFromUser(
        idUsers
      );
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getNotificationByIdAndUserId: async (req, res) => {
    try {
      const { idNotifications, idUsers } = req.params;
      const notification =
        await notificationService.getNotificationByIdAndUserId(
          idNotifications,
          idUsers
        );
      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addNotification: async (req, res) => {
    try {
      const { name, description, isActive, Users_idUsers } = req.body;
      await notificationService.addNotification(
        name,
        description,
        isActive,
        Users_idUsers
      );
      res.status(200).json({ message: "Notification added" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = notificationController;
