export class GetProductsUseCase {
  constructor({ productRepository, cache }) {
    this.productRepository = productRepository;
    this.cache = cache;
  }

  async execute(queryParams) {
    const cacheKey = `products:query:${JSON.stringify(queryParams)}`;

    // 1. Try Cache
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return { data: cached, source: 'CACHE' };
    }

    // 2. Fetch from Database Repository
    const result = await this.productRepository.findAll(queryParams);

    // 3. Save to Cache
    await this.cache.set(cacheKey, result, 60);

    return { data: result, source: 'DATABASE' };
  }

  async getByIdOrSlug(identifier) {
    const cacheKey = `products:detail:${identifier}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return { data: cached, source: 'CACHE' };
    }

    const product = await this.productRepository.findByIdOrSlug(identifier);
    if (product) {
      await this.cache.set(cacheKey, product, 120);
    }
    return { data: product, source: 'DATABASE' };
  }
}
