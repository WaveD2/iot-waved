function validateSensorData(data) {
    if (!data.userId) {
        return { valid: false, message: 'UserId is required' };
    }

    if (data.heartRate === undefined || isNaN(data.heartRate)) {
        return { valid: false, message: 'Heart rate must be a valid number' };
    }

    if (data.temperature === undefined || isNaN(data.temperature)) {
        return { valid: false, message: 'Temperature must be a valid number' };
    }

    // Kiểm tra giá trị hợp lý
    if (data.heartRate < 30 || data.heartRate > 220) {
        return { valid: false, message: 'Heart rate out of normal range (30-220 BPM)' };
    }

    if (data.temperature < 35 || data.temperature > 42) {
        return { valid: false, message: 'Temperature out of normal range (35-42°C)' };
    }

    return { valid: true };
}

module.exports = { validateSensorData };