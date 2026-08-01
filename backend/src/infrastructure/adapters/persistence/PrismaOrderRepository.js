import prisma from '../../../prisma.js';
import { Order } from '../../../domain/entities/Order.js';
import { OrderRepositoryPort } from '../../../domain/ports/OrderRepositoryPort.js';

export class PrismaOrderRepository extends OrderRepositoryPort {
  async createOrderWithStockDeduction({ userId, items, shippingAddress, paymentMethod }) {
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const productMap = new Map(products.map(p => [p.id, p]));
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`El producto con ID ${item.productId} no está disponible.`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}`);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal
      });
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const updatedProducts = [];
    const newOrder = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: 'PAID',
          totalAmount,
          shippingAddress,
          paymentMethod: paymentMethod || 'CREDIT_CARD',
          items: { create: orderItemsData }
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: true } }
        }
      });

      for (const item of items) {
        const prod = await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
          include: { category: true }
        });
        updatedProducts.push(prod);
      }

      return createdOrder;
    });

    return {
      order: new Order(newOrder),
      updatedProducts
    };
  }

  async findByUserId(userId) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return orders.map(o => new Order(o));
  }

  async findAll(statusFilter) {
    const where = statusFilter ? { status: statusFilter } : {};
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return orders.map(o => new Order(o));
  }

  async updateStatus(id, status) {
    const updated = await prisma.order.update({
      where: { id },
      data: { status }
    });
    return new Order(updated);
  }
}
