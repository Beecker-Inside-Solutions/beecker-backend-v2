const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const middleware = require("../middleware/jwt-middleware");

router.post("/login", userController.login);
router.get("/users", middleware.verifyJWT, middleware.verifyAdminJWT,userController.getUsers);

module.exports = router;
