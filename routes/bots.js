const express = require("express");
const router = express.Router();
const botsController = require("../controller/botsController");
const middleware = require("../middleware/jwt-middleware");

router.get(
  "/bots",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  botsController.getBots
);

router.get("/bots/:idBots", middleware.verifyJWT, botsController.getBot);

router.post(
  "/bots/add",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  botsController.addBot
);

router.put(
  "/bots/update/:idBots",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  botsController.updateBot
);

router.delete(
  "/bots/delete/:idBots",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  botsController.deleteBot
);

router.get(
  "/bots/project/:idProject",
  middleware.verifyJWT,
  botsController.getBotsByProject
);

router.get(
  "/bots/user/:idUser",
  middleware.verifyJWT,
  botsController.getBotsByUser
);

router.post(
  "/bots/inactivate/:idBots",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  botsController.setInactive
);

module.exports = router;
