const {
    getSensorDataByTimeRange,
    getAverageSensorData
} = require('./SensorService');
 
const { HealthModel, TemperatureModel } = require('../Model/Health');
const { triggerWs } = require('../websocket');

// Phân tích xu hướng nhịp tim
async function analyzeHeartRateTrend(
    userId,
    days
){
    try {
        if (!days || days <= 0) {
            throw new Error('Số ngày (days) không hợp lệ');
        }

        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999); // Kết thúc của ngày hiện tại

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days + 1); // Bắt đầu từ ngày `days` trước
        startDate.setHours(0, 0, 0, 0); // Đầu ngày đầu tiên

        // Lấy dữ liệu cảm biến trong khoảng thời gian
        const data = await getSensorDataByTimeRange(userId, startDate, endDate);

        if (!Array.isArray(data) || data.length === 0) {
            // Không có dữ liệu trả về, đánh dấu toàn bộ ngày là không có nhịp tim
            return { trend: 'stable', data: Array(days).fill(0) };
        }

        const dailyAverages = [];

        for (let i = 0; i < days; i++) {
            const currentDay = new Date(startDate);
            currentDay.setDate(currentDay.getDate() + i);

            const dayStart = new Date(currentDay);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(currentDay);
            dayEnd.setHours(23, 59, 59, 999);

            // Lọc ra dữ liệu trong ngày hiện tại
            const dayData = data.filter(item => {
                const timestamp = new Date(item.createdAt);
                return timestamp >= dayStart && timestamp <= dayEnd;
            });

            if (dayData.length > 0) {
                const sum = dayData.reduce((acc, item) => acc + item.heartRate, 0);
                const avg = parseFloat((sum / dayData.length).toFixed(1));
                dailyAverages.push(avg);
            } else {
                // Không có dữ liệu cho ngày này
                dailyAverages.push(0);
            }
        }

        // Xác định xu hướng
        let trend = 'stable';
        const validData = dailyAverages.filter(value => value > 0); // Loại ngày không có dữ liệu ra khỏi tính xu hướng

        if (validData.length >= 2) {
            const first = validData[0];
            const last = validData[validData.length - 1];
            const change = last - first;

            if (change > 5) {
                trend = 'increasing';
            } else if (change < -5) {
                trend = 'decreasing';
            }
        }

        // Gửi thông tin qua websocket den web
        triggerWs('user', `${userId}`, JSON.stringify({
            id: userId,
            trend,
            dailyAverages,
            data,
            title: 'heartRate',
            type : 'web'
        }));

        const result = {
            trend,
            dailyAverages,
            data
        }
        return result

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
                const timestamp = new Date(item.createdAt);
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


        return { trend, dailyAverages };
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
        const result = await HealthModel.create(data);
        const { trend, dailyAverages } = await analyzeHeartRateTrend(data.userId, 7);
        triggerWs('user', `${userId}`, JSON.stringify({
            id: userId,
            trend,
            dailyAverages,
            data: result,
            title: 'heartRate',
            type: 'web'
        }));

        return result;
    } catch (error) {
        throw error;
    }
}

async function createTemperature(data) {
    try {
        const result = await TemperatureModel.create(data);
        const { trend, dailyAverages } = await analyzeTemperatureTrend(data.userId, 7);
        triggerWs('user', `${userId}`, JSON.stringify({
            id: userId,
            trend,
            dailyAverages,
            data: result,
            title: 'temperature',
            type: 'web'
        }));
        return result;
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
