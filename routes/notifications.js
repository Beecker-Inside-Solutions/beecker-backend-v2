const express = require("express");
const router = express.Router();
const middleware = require("../middleware/jwt-middleware");
const notificationController = require("../controller/notificationsController");

router.get(
  "/notifications",
  middleware.verifyJWT,
  notificationController.getNotifications
);
router.get(
  "/notifications/:idNotifications",
  middleware.verifyJWT,
  notificationController.getNotificationById
);
router.delete(
  "/notifications/delete/:idNotifications",
  middleware.verifyJWT,
  notificationController.deleteNotification
);
router.get(
  "/notifications/user/:idUsers",
  middleware.verifyJWT,
  notificationController.getNotificationFromUser
);
router.get(
  "/notifications/:idNotifications/user/:idUsers",
  middleware.verifyJWT,
  notificationController.getNotificationByIdAndUserId
);

router.post(
  "/notifications/add",
  middleware.verifyJWT,
  notificationController.addNotification
);

module.exports = router;
