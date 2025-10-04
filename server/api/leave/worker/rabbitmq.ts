import * as amqp from "amqplib";
import { LeaveService } from "../service/leave.service";
import { RetryMechanism } from "../contract/retry.contract";
import { BackoffMechanism } from "./retry";

export async function PublishMessage(channel: amqp.Channel, key: string, message: string) {
  try {
    await channel.publish(process.env.EXCHANGE_NAME!, key, Buffer.from(message));
  } catch (error) {
    throw error;
  }
}

export async function SubscribeMessage(
  channel: amqp.Channel,
  queueName: string,
  service: LeaveService,
  key: string
) {
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

  await channel.bindQueue(queueName, process.env.EXCHANGE_NAME!, key);

  const retryMechanism: RetryMechanism = new BackoffMechanism();
  channel.consume(queueName, async (data) => {
    if (!data) return;
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
    } catch (err) {
      console.error("failed to process message:", err);
      channel.nack(data, false, false);
    }
  });

  console.log(`subscribed to queue: ${queueName} with dlq support`);
}
