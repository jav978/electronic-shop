export class ManageProductUseCase {
  constructor({ productRepository, cache, eventPublisher }) {
    this.productRepository = productRepository;
    this.cache = cache;
    this.eventPublisher = eventPublisher;
  }

  async createProduct(productData) {
    const product = await this.productRepository.create(productData);
    await this.cache.invalidateCatalog();
    this.eventPublisher.publishStockUpdate(product);
    return product;
  }

  async updateProduct(id, productData) {
    const product = await this.productRepository.update(id, productData);
    await this.cache.invalidateCatalog();
    this.eventPublisher.publishStockUpdate(product);
    return product;
  }

  async deleteProduct(id) {
    await this.productRepository.delete(id);
    await this.cache.invalidateCatalog();
    return { success: true };
  }
}
