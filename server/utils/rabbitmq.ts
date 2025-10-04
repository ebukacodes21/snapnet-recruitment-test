import * as amqp from "amqplib";

export async function CreateChannel() {
  try {
    const connection = await amqp.connect(process.env.MESSAGE_BROKER_URL!);
    const channel = await connection.createChannel();
    await channel.assertExchange(process.env.EXCHANGE_NAME!, "direct");
    return channel;
  } catch (error) {
    throw error;
  }
}