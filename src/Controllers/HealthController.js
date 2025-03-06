const HealthService = require("../services/HealthService");
const { STATUS_RESPONSE } = require("../utils/constants");

// lay danh sach nhip tim
const getHeartRateTrend = async (req, res) => {
  const currentUserId = req.user.id;
  const days = req.query.days ? parseInt(req.query.days) : 7;
  try {
    const response = await HealthService.analyzeHeartRateTrend(currentUserId, days)
    return res.status(200).json({
      status: STATUS_RESPONSE.OK,
      data: response
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// lay danh sach nhiet do
const getTemperatureTrend = async (req, res) => {
  try {
    const days = req.query.days ? parseInt(req.query.days) : 7;
    const userId = req.user.id;
    const response = await HealthService.analyzeTemperatureTrend(userId, days);
    return res.status(200).json({
      status: STATUS_RESPONSE.OK,
      data: response,
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};


const createHeart = async (req, res) => {
  try {
    const response = await HealthService.createHeart({
      userId: req.user.id,
      heartRate: req.body.heartRate
    })
    return res.status(200).json({
      status: STATUS_RESPONSE.OK,
      data: response,
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const createTemperature = async (req, res) => {
  try {
    const response = await HealthService.createTemperature({
      userId: req.user.id,
      temperature: req.body.temperature
    })
    return res.status(200).json({
      status: STATUS_RESPONSE.OK,
      data: response,
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getHealthReport = async (req, res) => {
  try {
    const days = req.query.days ? parseInt(req.query.days) : 10;
    const userId = req.user.id;
    const response = await HealthService.generateHealthReport(userId, days);
    return res.status(200).json({
      status: STATUS_RESPONSE.OK,
      data: response,
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  getHeartRateTrend,
  getTemperatureTrend,
  getHealthReport,
  createHeart,
  createTemperature
};
