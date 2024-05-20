const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const middleware = require("../middleware/jwt-middleware");

router.post("/login", userController.login);

router.post("/register", userController.registerUser);

router.get(
  "/users",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  userController.getUsers
);

router.get("/users/:idUsers", middleware.verifyJWT, userController.getUserById);

router.delete(
  "/users/delete/:idUsers",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  userController.deleteUser
);

router.get(
  "/user-types",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  userController.getUserTypes
);

router.put(
  "/users/updatePermissions/:idUsers",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  userController.updateUserPermissions
);

router.delete(
  "/users/delete/:idUsers",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  userController.deleteUser
);

module.exports = router;
