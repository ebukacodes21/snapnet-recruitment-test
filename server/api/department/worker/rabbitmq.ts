import * as amqp from "amqplib";

export async function PublishMessage(channel: amqp.Channel, key: string, message: string) {
  try {
    await channel.publish(process.env.EXCHANGE_NAME!, key, Buffer.from(message));
  } catch (error) {
    throw error;
  }
}

export async function SubscribeMessage(channel: amqp.Channel, queueName: string,  service: any, key: string) {
    const appQueue = await channel.assertQueue(queueName)
    channel.bindQueue(appQueue.queue, process.env.EXCHANGE_NAME!, key)

    channel.consume(appQueue.queue, data => {
        console.log("received data", data?.content.toString())
    })
}
