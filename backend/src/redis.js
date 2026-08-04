import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const IS_PROD = process.env.NODE_ENV === 'production';

let redis;

if (REDIS_URL) {
  redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: REDIS_URL.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined
  });
} else if (!IS_PROD) {
  redis = new Redis({
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    retryStrategy(times) {
      if (times > 3) return null; // Stop retrying if local Redis is down
      return Math.min(times * 50, 1000);
    }
  });
} else {
  // Silent in-memory fallback for production when no REDIS_URL is configured
  redis = {
    on: () => {},
    get: async () => null,
    set: async () => {},
    del: async () => {},
    keys: async () => []
  };
}

if (redis.on) {
  redis.on('connect', () => {
    console.log('🔴 Connected to Redis Server successfully.');
  });

  redis.on('error', (err) => {
    // Graceful error handler
  });
}

export async function getCache(key) {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function setCache(key, value, ttlSeconds = 60) {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {}
}

export async function invalidateCatalogCache() {
  try {
    const keys = await redis.keys('products:*');
    if (keys && keys.length > 0) {
      await redis.del(keys);
    }
  } catch {}
}

export default redis;
