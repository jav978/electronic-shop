export class CreateOrderUseCase {
  constructor({ orderRepository, cache, eventPublisher }) {
    this.orderRepository = orderRepository;
    this.cache = cache;
    this.eventPublisher = eventPublisher;
  }

  async execute({ userId, items, shippingAddress, paymentMethod }) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('El carrito de compras está vacío.');
    }
    if (!shippingAddress) {
      throw new Error('La dirección de envío es requerida.');
    }

    // Process order in repository adapter
    const result = await this.orderRepository.createOrderWithStockDeduction({
      userId,
      items,
      shippingAddress,
      paymentMethod
    });

    const { order, updatedProducts } = result;

    // Invalidate Redis catalog cache
    await this.cache.invalidateCatalog();

    // Broadcast Real-time WebSocket events
    for (const prod of updatedProducts) {
      this.eventPublisher.publishStockUpdate(prod);
    }
    this.eventPublisher.publishNewOrder(order);

    return order;
  }
}
