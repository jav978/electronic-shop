import { PrismaOrderRepository } from '../infrastructure/adapters/persistence/PrismaOrderRepository.js';
import { RedisCacheAdapter } from '../infrastructure/adapters/cache/RedisCacheAdapter.js';
import { SocketIOEventPublisher } from '../infrastructure/adapters/messaging/SocketIOEventPublisher.js';
import { CreateOrderUseCase } from '../application/use-cases/CreateOrderUseCase.js';
import { requireAuth, requireAdmin } from '../auth.js';

const orderRepository = new PrismaOrderRepository();
const cache = new RedisCacheAdapter();
const eventPublisher = new SocketIOEventPublisher();

const createOrderUseCase = new CreateOrderUseCase({ orderRepository, cache, eventPublisher });

export function registerOrdersService(app) {
  // Create order (Checkout) with Hexagonal Use Case
  app.post('/api/orders', requireAuth, async (req, res) => {
    try {
      const { items, shippingAddress, paymentMethod } = req.body;
      const order = await createOrderUseCase.execute({
        userId: req.user.id,
        items,
        shippingAddress,
        paymentMethod
      });
      return res.status(201).json(order);
    } catch (err) {
      console.error('Error creating order:', err);
      return res.status(500).json({ error: err.message || 'Error al procesar el pedido.' });
    }
  });

  // Get user orders
  app.get('/api/orders/my-orders', requireAuth, async (req, res) => {
    try {
      const orders = await orderRepository.findByUserId(req.user.id);
      return res.json(orders);
    } catch (err) {
      console.error('Error fetching user orders:', err);
      return res.status(500).json({ error: 'Error al obtener tus pedidos.' });
    }
  });

  // Get all orders (Admin)
  app.get('/api/orders', requireAdmin, async (req, res) => {
    try {
      const orders = await orderRepository.findAll(req.query.status);
      return res.json(orders);
    } catch (err) {
      console.error('Error fetching all orders:', err);
      return res.status(500).json({ error: 'Error al obtener la lista de pedidos.' });
    }
  });

  // Get order by ID
  app.get('/api/orders/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const order = await orderRepository.findAll();
      const target = order.find(o => o.id === id);

      if (!target) {
        return res.status(404).json({ error: 'Pedido no encontrado.' });
      }

      if (req.user.role !== 'ADMIN' && target.userId !== req.user.id) {
        return res.status(403).json({ error: 'Acceso denegado.' });
      }

      return res.json(target);
    } catch (err) {
      console.error('Error fetching order details:', err);
      return res.status(500).json({ error: 'Error al obtener detalles del pedido.' });
    }
  });

  // Update order status (Admin)
  app.patch('/api/orders/:id/status', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'El estado es requerido.' });
      }
      const updated = await orderRepository.updateStatus(id, status);
      return res.json(updated);
    } catch (err) {
      console.error('Error updating order status:', err);
      return res.status(500).json({ error: 'Error al actualizar el estado del pedido.' });
    }
  });
}
