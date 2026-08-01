import { CachePort } from '../../../domain/ports/CachePort.js';
import { getCache, setCache, invalidateCatalogCache } from '../../../redis.js';

export class RedisCacheAdapter extends CachePort {
  async get(key) {
    return await getCache(key);
  }

  async set(key, value, ttlSeconds = 60) {
    await setCache(key, value, ttlSeconds);
  }

  async invalidateCatalog() {
    await invalidateCatalogCache();
  }
}
