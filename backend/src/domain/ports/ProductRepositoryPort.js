export class ProductRepositoryPort {
  async findAll(filters) { throw new Error('Not implemented'); }
  async findByIdOrSlug(identifier) { throw new Error('Not implemented'); }
  async create(productData) { throw new Error('Not implemented'); }
  async update(id, productData) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
  async findLowStock(threshold) { throw new Error('Not implemented'); }
}
