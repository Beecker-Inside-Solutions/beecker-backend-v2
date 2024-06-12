const forgotController = require("../controller/forgotController");

const router = require("express").Router();

router.post("/forgot", forgotController.forgotPassword);
router.post("/resetPassword", forgotController.resetPassword);

module.exports = router;
