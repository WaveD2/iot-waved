const {
  saveSensorData,
  getSensorDataByUserId,
  getSensorDataByTimeRange,
  getLatestSensorData,
  getAverageSensorData
} = require('../services/SensorService');
const { helper } = require('../utils/fun');

// Lưu dữ liệu từ cảm biến
async function recordSensorData(req, res) {
  try {
    const { heartRate, temperature } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Không có thông tin người dùng' });
      return;
    }

    const sensorData = {
      userId: helper.getMongoId(userId),
      heartRate: parseFloat(heartRate),
      temperature: parseFloat(temperature),
      timestamp: new Date()
    };

    const savedData = await saveSensorData(sensorData);
    res.status(201).json(savedData);
  } catch (error) {
    console.error('Error recording sensor data:', error);
    res.status(400).json({ message: error.message });
  }
}

// Lấy dữ liệu cảm biến của người dùng
async function getUserSensorData(req, res) {
  try {
    const userId = req.user?._id;
    const filter = {}
    if (req.query) {
      filter['limit'] = req.query.limit ? parseInt(req.query.limit) : 10;
    }

    if (!userId) {
      res.status(401).json({ message: 'Không có thông tin người dùng' });
      return;
    }

    const data = await getSensorDataByUserId(userId.toString(), filter.limit);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error getting user sensor data:', error);
    res.status(500).json({ message: error.message });
  }
}

// Lấy dữ liệu cảm biến theo khoảng thời gian
async function getSensorDataByTime(req, res) {
  try {
    const userId = req.user?._id;
    //@ts-ignore
    const { startTime, endTime } = req.query;

    if (!userId) {
      res.status(401).json({ message: 'Không có thông tin người dùng' });
      return;
    }

    if (!startTime || !endTime) {
      res.status(400).json({ message: 'Cần cung cấp thời gian bắt đầu và kết thúc' });
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    const data = await getSensorDataByTimeRange(userId.toString(), start, end);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error getting sensor data by time:', error);
    res.status(500).json({ message: error.message });
  }
}

// Lấy dữ liệu cảm biến mới nhất
async function getLatestData(req, res) {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Không có thông tin người dùng' });
      return;
    }

    const data = await getLatestSensorData(userId.toString());

    if (!data) {
      res.status(404).json({ message: 'Không có dữ liệu' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error getting latest sensor data:', error);
    res.status(500).json({ message: error.message });
  }
}

// Lấy dữ liệu trung bình
async function getAverageData(req, res) {
  try {
    const userId = req.user?._id;
    //@ts-ignore
    const { startTime, endTime } = req.query;

    if (!userId) {
      res.status(401).json({ message: 'Không có thông tin người dùng' });
      return;
    }

    if (!startTime || !endTime) {
      res.status(400).json({ message: 'Cần cung cấp thời gian bắt đầu và kết thúc' });
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    const data = await getAverageSensorData(userId.toString(), start, end);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error getting average sensor data:', error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  recordSensorData,
  getUserSensorData,
  getSensorDataByTime,
  getLatestData,
  getAverageData
};