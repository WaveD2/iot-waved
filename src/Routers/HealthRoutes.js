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
router.get("/", getHeartRateTrend);
router.get("/temperature", getTemperatureTrend);
router.get("/health-report", getHealthReport);


module.exports = router;
