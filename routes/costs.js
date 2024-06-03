const express = require("express");
const router = express.Router();
const middleware = require("../middleware/jwt-middleware");
const costsController = require("../controller/costsController");

router.post("/costs/add", middleware.verifyJWT, costsController.addCost);

router.get(
  "/costs/getCostByBotId/:botId",
  middleware.verifyJWT,
  costsController.getCostByBotId
);

router.post(
  "/costs/calculate/:botId",
  middleware.verifyJWT,
  costsController.calculateCosts
);

router.post(
  "/costs/chart/:botId",
  middleware.verifyJWT,
  costsController.costsChart
);
module.exports = router;
