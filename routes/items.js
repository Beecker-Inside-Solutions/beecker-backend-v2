const express = require("express");
const router = express.Router();
const middleware = require("../middleware/jwt-middleware");
const itemsController = require("../controller/itemsController");

router.get("/items", middleware.verifyJWT, itemsController.getItems);

router.post("/items/add", middleware.verifyJWT, itemsController.addItem);

router.get(
  "/items/calculateExecutionTime/:botId",
  middleware.verifyJWT,
  itemsController.calculateExecutionTime
);

router.get(
  "/items/calculateHoursSaved/:botId",
  middleware.verifyJWT,
  itemsController.calculateHoursSaved
);
module.exports = router;
