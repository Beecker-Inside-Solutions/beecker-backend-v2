const express = require("express");
const router = express.Router();
const rolesController = require("../controller/rolesController");
const middleware = require("../middleware/jwt-middleware");

router.get("/roles", middleware.verifyJWT, rolesController.getRoles);

router.post(
  "/roles/add",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  rolesController.addRole
);

router.put(
  "/roles/update/:idRole",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  rolesController.updateRole
);

router.delete(
  "/roles/delete/:idRole",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  rolesController.deleteRole
);

module.exports = router;
