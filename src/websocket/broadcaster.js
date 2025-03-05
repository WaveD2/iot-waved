const WebSocket = require("ws");

let adminClient = null;
let isConnected = false;

const getSoketiAdminClient = async () => {
    if (adminClient && isConnected) {
        return adminClient;
    }

    const url = process.env.SOKETI_SERVER_URL
    
    adminClient = new WebSocket(url);

    return new Promise((resolve, reject) => {
        adminClient.on('open', () => {
            console.log("WebSocket URL::", url);
            console.log('Admin WebSocket connected');
            isConnected = true;
            resolve(adminClient);
        });

        adminClient.on('error', (err) => {
            console.error('Admin WebSocket error:', err);
            isConnected = false;
            reject(err);
        });

        adminClient.on('close', () => {
            console.warn('Admin WebSocket closed');
            isConnected = false;
            adminClient = null;
        });
    });
};


const triggerWs = async (channelName, eventName, message) => {
    if (!adminClient || adminClient.readyState !== WebSocket.OPEN) {
      await  getSoketiAdminClient();
    }

    const payload = JSON.stringify({
        event: eventName,
        channel: channelName,
        data: message,
    });
    console.log("payload::", payload);
    
    adminClient?.send(payload, (err) => {
        if (err) {
            console.error('WebSocket send error:', err);
        } else {
            console.log(`[WS] Gửi qua channel "${channelName}" và event "${eventName}" thành công!`);
        }
    });
};


module.exports = {
    adminClient,
    triggerWs,
    getSoketiAdminClient
}