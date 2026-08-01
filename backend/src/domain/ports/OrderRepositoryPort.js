export class OrderRepositoryPort {
  async createOrderWithStockDeduction({ userId, items, shippingAddress, paymentMethod }) { throw new Error('Not implemented'); }
  async findByUserId(userId) { throw new Error('Not implemented'); }
  async findAll(filters) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async updateStatus(id, status) { throw new Error('Not implemented'); }
}
