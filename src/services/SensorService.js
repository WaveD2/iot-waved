const { HealthModel, TemperatureModel } = require('../Model/Health');
const { validateSensorData } = require('../validations/validateSensor');
const { createNotificationIfNeeded } = require('../services/NotificationService');
const { logger } = require('../utils/logger');

async function saveSensorData(data) {
    try {
        const validation = validateSensorData(data);
        if (!validation.valid) {
            throw new Error(validation.message);
        }

        // Lưu vào database
        const newHealthModel = await HealthModel.create(data);

        // Kiểm tra và tạo thông báo nếu cần
        await createNotificationIfNeeded(data);

        return newHealthModel;
    } catch (error) {
        throw error;
    }
}

async function getSensorDataByUserId(userId, limit) {
    try {
        const healthModel = await HealthModel.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit);

        return healthModel;
    } catch (error) {
        throw error;
    }
}

// Lấy dữ liệu cảm biến trong khoảng thời gian
async function getSensorDataByTimeRange(
    userId,
    startTime,
    endTime
) {
    try {
        return await HealthModel.find({
            userId,
            createdAt: { $gte: startTime, $lte: endTime }
        }).sort({ createdAt: 1 });
    } catch (error) {
        throw error;
    }
}

// Lấy dữ liệu cảm biến mới nhất
async function getLatestSensorData(userId) {
    try {
       return await HealthModel.findOne({ userId })
            .sort({ createdAt: -1 });
    } catch (error) {
        logger.error('Error getting latest sensor data:', error);
        throw error;
    }
}

// Tính trung bình dữ liệu trong khoảng thời gian
async function getAverageSensorData(
    userId,
    startTime,
    endTime
){
    try {
        const result = await HealthModel.aggregate([
            {
                $match: {
                    userId: userId,
                    createdAt: { $gte: startTime, $lte: endTime }
                }
            },
            {
                $group: {
                    _id: null,
                    averageHeartRate: { $avg: '$heartRate' },
                    averageTemperature: { $avg: '$temperature' }
                }
            }
        ]);

        if (result.length === 0) {
            return { averageHeartRate: 0, averageTemperature: 0 };
        }

        return {
            averageHeartRate: parseFloat(result[0].averageHeartRate.toFixed(1)),
            averageTemperature: parseFloat(result[0].averageTemperature.toFixed(1))
        };
    } catch (error) {
        throw error;
    }
}

module.exports = {
    saveSensorData,
    getSensorDataByUserId,
    getSensorDataByTimeRange,
    getLatestSensorData,
    getAverageSensorData
};
