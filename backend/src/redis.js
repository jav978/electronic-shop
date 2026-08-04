import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const redis = REDIS_URL
  ? new Redis(REDIS_URL, {
      maxRetriesPerRequest: null,
      tls: REDIS_URL.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined
    })
  : new Redis({
      host: REDIS_HOST,
      port: Number(REDIS_PORT),
      retryStrategy(times) {
        return Math.min(times * 50, 2000);
      }
    });

redis.on('connect', () => {
  console.log('🔴 Connected to Redis Server successfully.');
});

redis.on('error', (err) => {
  console.error('⚠️ Redis connection error:', err.message);
});

export async function getCache(key) {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Redis getCache error:', err.message);
    return null;
  }
}

export async function setCache(key, value, ttlSeconds = 60) {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (err) {
    console.error('Redis setCache error:', err.message);
  }
}

export async function invalidateCatalogCache() {
  try {
    const keys = await redis.keys('products:*');
    if (keys.length > 0) {
      await redis.del(keys);
      console.log(`🧹 Redis invalidated ${keys.length} product cache keys.`);
    }
  } catch (err) {
    console.error('Redis invalidate error:', err.message);
  }
}

export default redis;
