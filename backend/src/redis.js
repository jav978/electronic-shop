import Redis from 'ioredis';

const UPSTASH_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_URL = process.env.REDIS_URL;
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const IS_PROD = process.env.NODE_ENV === 'production';

let redisClient = null;

if (REDIS_URL) {
  redisClient = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: REDIS_URL.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined
  });
  redisClient.on('connect', () => console.log('🔴 Connected to Redis Server (TCP) successfully.'));
  redisClient.on('error', () => {});
} else if (!IS_PROD) {
  redisClient = new Redis({
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 50, 1000);
    }
  });
  redisClient.on('connect', () => console.log('🔴 Connected to Local Redis successfully.'));
  redisClient.on('error', () => {});
}

if (UPSTASH_REST_URL && UPSTASH_REST_TOKEN) {
  console.log('🔴 Upstash Redis REST API Engine ACTIVE & READY.');
}

export async function getCache(key) {
  try {
    if (UPSTASH_REST_URL && UPSTASH_REST_TOKEN) {
      const res = await fetch(`${UPSTASH_REST_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${UPSTASH_REST_TOKEN}` }
      });
      const data = await res.json();
      return data.result ? JSON.parse(data.result) : null;
    }
    if (redisClient) {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    }
  } catch (err) {
    console.error('Redis getCache error:', err.message);
  }
  return null;
}

export async function setCache(key, value, ttlSeconds = 60) {
  try {
    if (UPSTASH_REST_URL && UPSTASH_REST_TOKEN) {
      await fetch(`${UPSTASH_REST_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(JSON.stringify(value))}?EX=${ttlSeconds}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${UPSTASH_REST_TOKEN}` }
      });
      return;
    }
    if (redisClient) {
      await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    }
  } catch (err) {
    console.error('Redis setCache error:', err.message);
  }
}

export async function invalidateCatalogCache() {
  try {
    if (UPSTASH_REST_URL && UPSTASH_REST_TOKEN) {
      const res = await fetch(`${UPSTASH_REST_URL}/keys/products:*`, {
        headers: { Authorization: `Bearer ${UPSTASH_REST_TOKEN}` }
      });
      const data = await res.json();
      if (data.result && data.result.length > 0) {
        await fetch(`${UPSTASH_REST_URL}/pipeline`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${UPSTASH_REST_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(data.result.map((k) => ['DEL', k]))
        });
        console.log(`🧹 Upstash REST invalidated ${data.result.length} cache keys.`);
      }
      return;
    }
    if (redisClient) {
      const keys = await redisClient.keys('products:*');
      if (keys && keys.length > 0) {
        await redisClient.del(keys);
      }
    }
  } catch (err) {
    console.error('Redis invalidate error:', err.message);
  }
}

export default redisClient;
