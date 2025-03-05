const Pusher = require('pusher');


let adminClient;
let initedAdminClient = false;
const getSoketiAdminClient = () => {
    if (initedAdminClient) return adminClient;
    if (!adminClient) {
        adminClient = new Pusher({
            appId: "1952346",
            key: "d1641eea53e864ddefb2",
            secret: "034b616d9d512c185d7d",
            cluster: "ap1",
            useTLS: true
        });
    }
    console.log('Connected To Soketi as Admin');
    initedAdminClient = true;
    return adminClient;
};
 
const triggerWs = (channelName, eventName, message) => {
    if (!adminClient) {
        getSoketiAdminClient()
    }
    adminClient.trigger(channelName || soketiConfig.channel, eventName, {
        message,
    });
    console.log(`[WS] Gửi message "${message}" qua channel "${channelName}" và event "${eventName}" thành công!`);
}

module.exports = {
    triggerWs,
    getSoketiAdminClient
}