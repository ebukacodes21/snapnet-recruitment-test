"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishMessage = PublishMessage;
exports.SubscribeMessage = SubscribeMessage;
const retry_1 = require("./retry");
async function PublishMessage(channel, key, message) {
    try {
        await channel.publish(process.env.EXCHANGE_NAME, key, Buffer.from(message));
    }
    catch (error) {
        throw error;
    }
}
async function SubscribeMessage(channel, queueName, service, key) {
    const dlxExchange = `${queueName}.dlx`;
    const dlqRoutingKey = `${queueName}.dlq`;
    const dlqName = `${queueName}.dlq`;
    // setup dlx and dlq
    await channel.assertExchange(dlxExchange, "direct", { durable: true });
    await channel.assertQueue(dlqName, { durable: true });
    await channel.bindQueue(dlqName, dlxExchange, dlqRoutingKey);
    // setup main queue with dead letter config
    await channel.assertQueue(queueName, {
        durable: true,
        arguments: {
            "x-dead-letter-exchange": dlxExchange,
            "x-dead-letter-routing-key": dlqRoutingKey,
        },
    });
    await channel.bindQueue(queueName, process.env.EXCHANGE_NAME, key);
    const retryMechanism = new retry_1.BackoffMechanism();
    channel.consume(queueName, async (data) => {
        if (!data)
            return;
        const payload = JSON.parse(data.content.toString());
        try {
            switch (payload.event) {
                case "MANAGE_LEAVE":
                    await retryMechanism.execute(() => service.ManageLeave(payload));
                    break;
                default:
                    console.warn(`unhandled event type: ${payload.event}`);
            }
            channel.ack(data);
        }
        catch (err) {
            console.error("failed to process message:", err);
            channel.nack(data, false, false);
        }
    });
    console.log(`subscribed to queue: ${queueName} with dlq support`);
}
