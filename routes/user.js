const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const middleware = require("../middleware/jwt-middleware");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get(
  "/users",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  userController.getUsers
);
router.get("/users/:idUsers", middleware.verifyJWT, userController.getUser);
router.delete(
  "/users/:idUsers",
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
  "/users/:idUsers",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  userController.updateUser
);

module.exports = router;
