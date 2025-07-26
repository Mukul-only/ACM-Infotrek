// redis-client.js
import redis from 'redis';
import logger from './logger.js';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected');
    logger.info('✅ Redis connection established');
  } catch (err) {
    console.error('❌ Redis connection error:', err);
    logger.error('❌ Redis connection error:', err);
    process.exit(1);
  }
}

export { redisClient, connectRedis };
