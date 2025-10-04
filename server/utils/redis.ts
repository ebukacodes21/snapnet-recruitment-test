import { createClient } from 'redis';
import dotenv from 'dotenv'
dotenv.config()

const redisUrl = process.env.REDIS_URL!;
const redisClient = createClient({ url: redisUrl });
redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

export default redisClient;
