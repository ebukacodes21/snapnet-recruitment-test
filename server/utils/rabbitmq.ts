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

export const checkRabbitMQHealth = async (): Promise<{ status: string; message: string }> => {
  const url = process.env.MESSAGE_BROKER_URL!;

  try {
    const connection = await amqp.connect(url);
    await connection.close();
    return { status: "OK", message: "rabbitmq reachable" };
  } catch (error: any) {
    console.error("[rabbitmq Health Check] Connection failed:", error.message);
    return { status: "ERROR", message: error.message };
  }
};
