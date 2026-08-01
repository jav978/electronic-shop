export class CachePort {
  async get(key) { throw new Error('Not implemented'); }
  async set(key, value, ttlSeconds) { throw new Error('Not implemented'); }
  async invalidateCatalog() { throw new Error('Not implemented'); }
}
