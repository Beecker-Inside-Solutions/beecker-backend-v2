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

router.get(
  "/bots/project/:idProject",
  middleware.verifyJWT,
  botsController.getBotsByProject
);

router.post(
  "/bots/inactivate/:idBots",
  middleware.verifyJWT,
  middleware.verifyAdminJWT,
  botsController.setInactive
);

router.post("/bots/executions/:idBot", botsController.getBotExecutions);

router.post("/bot/executionsRate/:idBot", botsController.getSuccessAndFailRate);

router.post("/bots/roi/:idBot", botsController.calculateRoi);

router.post("/bots/savedHours/:idBot", botsController.getSavedHours);

router.post("/bots/averageSuccess/:idBot", botsController.calculateAverageSuccess);

module.exports = router;
