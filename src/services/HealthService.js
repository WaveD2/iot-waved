const {
    getSensorDataByTimeRange,
    getAverageSensorData
} = require('./SensorService');
 
const { HealthModel, TemperatureModel } = require('../Model/Health');

// Phân tích xu hướng nhịp tim
async function analyzeHeartRateTrend(
    userId,
    days
){
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Lấy dữ liệu trong khoảng thời gian
        const data = await getSensorDataByTimeRange(userId, startDate, endDate);

        // Tính trung bình nhịp tim theo ngày
        const dailyAverages= [];
        for (let i = 0; i < days; i++) {
            const day = new Date(startDate);
            day.setDate(day.getDate() + i);

            const dayStart = new Date(day);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);

            const dayData = data.filter(item => {
                const timestamp = new Date(item.timestamp);
                return timestamp >= dayStart && timestamp <= dayEnd;
            });

            if (dayData.length > 0) {
                const sum = dayData.reduce((acc, item) => acc + item.heartRate, 0);
                dailyAverages.push(parseFloat((sum / dayData.length).toFixed(1)));
            } else {
                dailyAverages.push(0);
            }
        }

        // Xác định xu hướng
        //'increasing' | 'decreasing' | 'stable'
        let trend = 'stable';
        if (dailyAverages.length >= 2) {
            const first = dailyAverages[0];
            const last = dailyAverages[dailyAverages.length - 1];

            if (last - first > 5) {
                trend = 'increasing';
            } else if (first - last > 5) {
                trend = 'decreasing';
            }
        }

        return { trend, data: dailyAverages };
    } catch (error) {
        console.error('Lỗi tính toán nhịp tim:', error);
        throw error;
    }
}

// Phân tích sự thay đổi nhiệt độ
async function analyzeTemperatureTrend(
    userId,
    days
){
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Lấy dữ liệu trong khoảng thời gian
        const data = await getSensorDataByTimeRange(userId, startDate, endDate);

        // Tính trung bình nhiệt độ theo ngày
        const dailyAverages = [];
        for (let i = 0; i < days; i++) {
            const day = new Date(startDate);
            day.setDate(day.getDate() + i);

            const dayStart = new Date(day);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);

            const dayData = data.filter(item => {
                const timestamp = new Date(item.timestamp);
                return timestamp >= dayStart && timestamp <= dayEnd;
            });

            if (dayData.length > 0) {
                const sum = dayData.reduce((acc, item) => acc + item.temperature, 0);
                dailyAverages.push(parseFloat((sum / dayData.length).toFixed(1)));
            } else {
                dailyAverages.push(0);
            }
        }

        // Xác định xu hướng
        let trend ='stable';
        if (dailyAverages.length >= 2) {
            const first = dailyAverages[0];
            const last = dailyAverages[dailyAverages.length - 1];

            if (last - first > 0.5) {
                trend = 'increasing';
            } else if (first - last > 0.5) {
                trend = 'decreasing';
            }
        }

        return { trend, data: dailyAverages };
    } catch (error) {
        console.error('Lỗi tính toán nhiệt độ:', error);
        throw error;
    }
}

// Tạo báo cáo sức khỏe
async function generateHealthReport(
    userId,
    days
){
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Lấy dữ liệu trung bình
        const averageData = await getAverageSensorData(userId, startDate, endDate);

        // Phân tích xu hướng
        const heartRateTrend = await analyzeHeartRateTrend(userId, days);
        const temperatureTrend = await analyzeTemperatureTrend(userId, days);

        // Đếm số lần cảnh báo
        const data = await getSensorDataByTimeRange(userId, startDate, endDate);

        const highHeartRateCount = data.filter(item => item.heartRate > THRESHOLDS.HEART_RATE.HIGH).length;
        const lowHeartRateCount = data.filter(item => item.heartRate < THRESHOLDS.HEART_RATE.LOW).length;
        const highTempCount = data.filter(item => item.temperature > THRESHOLDS.TEMPERATURE.HIGH).length;
        const lowTempCount = data.filter(item => item.temperature < THRESHOLDS.TEMPERATURE.LOW).length;

        // Tạo báo cáo
        const report = {
            period: {
                start: startDate,
                end: endDate,
                days
            },
            averages: averageData,
            trends: {
                heartRate: heartRateTrend,
                temperature: temperatureTrend
            },
            alerts: {
                highHeartRate: highHeartRateCount,
                lowHeartRate: lowHeartRateCount,
                highTemperature: highTempCount,
                lowTemperature: lowTempCount,
                total: highHeartRateCount + lowHeartRateCount + highTempCount + lowTempCount
            },
            dataPoints: data.length
        };

        return report;
    } catch (error) {
        throw error;
    }
}

async function createHeart(data) {
    try {
        return await HealthModel.create(data);
    } catch (error) {
        throw error;
    }
}

async function createTemperature(data) {
    try {
        return await TemperatureModel.create(data);
    } catch (error) {
        throw error;
    }
}


module.exports =  {
    analyzeHeartRateTrend,
    analyzeTemperatureTrend,
    generateHealthReport,
    createHeart,
    createTemperature
};
