const express = require("express");
const router = express.Router();
const {
  getHeartRateTrend,
  getTemperatureTrend,
  getHealthReport,
  createTemperature,
  createHeart
} =  require("../Controllers/HealthController.js");
const { authMiddleware} = require("../middleware/authMiddleware");

router.use(authMiddleware);
router.post("/heart", createHeart);
router.post("/temperature", createTemperature);
router.get("/heart-rate", getHeartRateTrend);
router.get("/temperature-rate", getTemperatureTrend);
router.get("/health-report", getHealthReport);


module.exports = router;
