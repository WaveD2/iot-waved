const express = require("express");
const router = express.Router();
const {
  recordSensorData,
  getUserSensorData,
  getSensorDataByTime,
  getLatestData,
  getAverageData
} =  require("../Controllers/SensorController.js")

const {
  authUserMiddleware,
  authMiddleware,
} = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post('/record', recordSensorData);
router.get('/data', getUserSensorData);
router.get('/data/range', getSensorDataByTime);
router.get('/data/latest', getLatestData);
router.get('/data/average', getAverageData);

module.exports = router;
