const express = require("express");
const router = express.Router();
const projectController = require("../controller/projectController");
const middleware = require("../middleware/jwt-middleware");

router.get("/projects", middleware.verifyJWT, projectController.getProjects);
router.get(
  "/projects/:idProject",
  middleware.verifyJWT,
  projectController.getProject
);
router.post(
  "/projects/add",
  middleware.verifyJWT,
  projectController.addProject
);
router.put(
  "/projects/update/:idProject",
  middleware.verifyJWT,
  projectController.updateProject
);
router.delete(
  "/projects/delete/:idProject",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  projectController.deleteProject
);
router.get(
  "/projects/user/:idUser",
  middleware.verifyJWT,
  projectController.getProjectByUserId
);

router.get(
  "/projects/:idProject/user/:idUser",
  middleware.verifyJWT,
  projectController.getProjectByUserIdAndProjectId
);

module.exports = router;
