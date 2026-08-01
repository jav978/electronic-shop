import { PrismaProductRepository } from '../infrastructure/adapters/persistence/PrismaProductRepository.js';
import { RedisCacheAdapter } from '../infrastructure/adapters/cache/RedisCacheAdapter.js';
import { SocketIOEventPublisher } from '../infrastructure/adapters/messaging/SocketIOEventPublisher.js';
import { GetProductsUseCase } from '../application/use-cases/GetProductsUseCase.js';
import { ManageProductUseCase } from '../application/use-cases/ManageProductUseCase.js';
import { requireAdmin } from '../auth.js';

const productRepository = new PrismaProductRepository();
const cache = new RedisCacheAdapter();
const eventPublisher = new SocketIOEventPublisher();

const getProductsUseCase = new GetProductsUseCase({ productRepository, cache });
const manageProductUseCase = new ManageProductUseCase({ productRepository, cache, eventPublisher });

export function registerProductsService(app) {
  // Get all products with Hexagonal Use Case
  app.get('/api/products', async (req, res) => {
    try {
      const { data, source } = await getProductsUseCase.execute(req.query);
      res.setHeader('X-Cache', source === 'CACHE' ? 'HIT' : 'MISS');
      return res.json(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Error al obtener productos.' });
    }
  });

  // Get product by id or slug
  app.get('/api/products/:identifier', async (req, res) => {
    try {
      const { identifier } = req.params;
      const { data, source } = await getProductsUseCase.getByIdOrSlug(identifier);
      if (!data) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
      }
      res.setHeader('X-Cache', source === 'CACHE' ? 'HIT' : 'MISS');
      return res.json(data);
    } catch (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ error: 'Error al obtener el producto.' });
    }
  });

  // Create product (Admin)
  app.post('/api/products', requireAdmin, async (req, res) => {
    try {
      const product = await manageProductUseCase.createProduct(req.body);
      return res.status(201).json(product);
    } catch (err) {
      console.error('Error creating product:', err);
      return res.status(500).json({ error: err.message || 'Error al crear producto.' });
    }
  });

  // Update product (Admin)
  app.put('/api/products/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const product = await manageProductUseCase.updateProduct(id, req.body);
      return res.json(product);
    } catch (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ error: 'Error al actualizar producto.' });
    }
  });

  // Delete product (Admin)
  app.delete('/api/products/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await manageProductUseCase.deleteProduct(id);
      return res.json({ message: 'Producto eliminado correctamente.' });
    } catch (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ error: 'Error al eliminar producto.' });
    }
  });
}
