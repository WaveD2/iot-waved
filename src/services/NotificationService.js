const Notification = require('../Model/Notification');
const { sendNotification } = require('../config/websocket');
const { logger } = require('../utils/logger');

// Các ngưỡng cảnh báo
const THRESHOLDS = {
    HEART_RATE: {
        HIGH: 120,
        LOW: 45
    },
    TEMPERATURE: {
        HIGH: 38.5,
        LOW: 35.5
    }
};

// Kiểm tra và tạo thông báo nếu cần
async function createNotificationIfNeeded(data) {
    try {
        let notificationType = null;
        let message = '';

        // Kiểm tra nhịp tim
        if (data.heartRate > THRESHOLDS.HEART_RATE.HIGH) {
            notificationType = 'HIGH_HEART_RATE';
            message = `Cảnh báo: Nhịp tim cao (${data.heartRate} BPM)`;
        } else if (data.heartRate < THRESHOLDS.HEART_RATE.LOW) {
            notificationType = 'LOW_HEART_RATE';
            message = `Cảnh báo: Nhịp tim thấp (${data.heartRate} BPM)`;
        }

        // Kiểm tra nhiệt độ
        if (data.temperature > THRESHOLDS.TEMPERATURE.HIGH) {
            notificationType = 'HIGH_TEMPERATURE';
            message = `Cảnh báo: Nhiệt độ cao (${data.temperature}°C)`;
        } else if (data.temperature < THRESHOLDS.TEMPERATURE.LOW) {
            notificationType = 'LOW_TEMPERATURE';
            message = `Cảnh báo: Nhiệt độ thấp (${data.temperature}°C)`;
        }

        // Nếu có cảnh báo, tạo thông báo và gửi qua WebSocket
        if (notificationType && message) {
            const notification = new Notification({
                userId: data.userId,
                type: notificationType,
                message,
                read: false,
                createdAt: new Date()
            });

            await notification.save();

            // Gửi thông báo qua WebSocket
            const wsMessage = {
                type: 'NOTIFICATION',
                payload: {
                    id: notification._id,
                    type: notificationType,
                    message,
                    timestamp: notification.createdAt
                }
            };

            sendNotification(data.userId, wsMessage);
            logger.info(`Notification created and sent: ${message}`);
        }
    } catch (error) {
        logger.error('Error creating notification:', error);
        throw error;
    }
}

// Lấy thông báo cho một người dùng
async function getNotificationsByUserId(userId, limit){
    try {
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit);

        return notifications;
    } catch (error) {
        logger.error('Error getting notifications:', error);
        throw error;
    }
}

// Đánh dấu thông báo đã đọc
async function markNotificationAsRead(notificationId) {
    try {
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );

        return notification;
    } catch (error) {
        logger.error('Error marking notification as read:', error);
        throw error;
    }
}

// Đánh dấu tất cả thông báo của người dùng đã đọc
async function markAllNotificationsAsRead(userId) {
    try {
        await Notification.updateMany(
            { userId, read: false },
            { read: true }
        );
    } catch (error) {
        logger.error('Error marking all notifications as read:', error);
        throw error;
    }
}

module.exports = {
    createNotificationIfNeeded,
    getNotificationsByUserId,
    markNotificationAsRead,
    markAllNotificationsAsRead
};