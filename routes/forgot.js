const forgotController = require("../controller/forgotController");

const router = require("express").Router();

router.post("/forgot", forgotController.forgotPassword);

module.exports = router;
