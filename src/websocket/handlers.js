import { triggerWs, getSoketiAdminClient } from './ws-service';

// Đảm bảo admin client khởi tạo trước
getSoketiAdminClient();

// Hàm ví dụ để gửi thông báo tới user
const sendNotification = (userId, message) => {
    const channelName = `private-user-${userId}`;
    const eventName = 'notification';
    triggerWs(channelName, eventName, { text: message });
};

// Ví dụ gọi ở controller hoặc bất kỳ đâu
sendNotification('user123', 'Bạn có tin nhắn mới!');
