const WebSocket = require('ws');

function createWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('New client connected');

        ws.on('message', (message) => {
            console.log('Received message:', message);

            // Xử lý message tại đây nếu cần
            // Ví dụ: broadcast message cho các client khác
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });

        ws.on('error', (err) => {
            console.error('WebSocket error:', err);
        });

        ws.send('Welcome to WebSocket Server');
    });

    return wss;
}

module.exports = createWebSocketServer;
