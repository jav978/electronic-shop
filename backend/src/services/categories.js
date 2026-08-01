import prisma from '../prisma.js';
import { requireAdmin } from '../auth.js';

export function registerCategoriesService(app) {
  // Get all categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { products: true }
          }
        },
        orderBy: { name: 'asc' }
      });
      return res.json(categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ error: 'Error al obtener categorías.' });
    }
  });

  // Get category by slug or id
  app.get('/api/categories/:identifier', async (req, res) => {
    try {
      const { identifier } = req.params;
      const category = await prisma.category.findFirst({
        where: {
          OR: [
            { id: identifier },
            { slug: identifier }
          ]
        },
        include: {
          products: {
            include: { category: true }
          }
        }
      });
      if (!category) {
        return res.status(404).json({ error: 'Categoría no encontrada.' });
      }
      return res.json(category);
    } catch (err) {
      console.error('Error fetching category:', err);
      return res.status(500).json({ error: 'Error al obtener la categoría.' });
    }
  });

  // Create category (Admin)
  app.post('/api/categories', requireAdmin, async (req, res) => {
    try {
      const { name, slug, description, image } = req.body;
      if (!name || !slug) {
        return res.status(400).json({ error: 'Nombre y slug son requeridos.' });
      }
      const category = await prisma.category.create({
        data: { name, slug, description, image }
      });
      return res.status(201).json(category);
    } catch (err) {
      console.error('Error creating category:', err);
      return res.status(500).json({ error: 'Error al crear la categoría.' });
    }
  });

  // Update category (Admin)
  app.put('/api/categories/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, slug, description, image } = req.body;
      const category = await prisma.category.update({
        where: { id },
        data: { name, slug, description, image }
      });
      return res.json(category);
    } catch (err) {
      console.error('Error updating category:', err);
      return res.status(500).json({ error: 'Error al actualizar categoría.' });
    }
  });

  // Delete category (Admin)
  app.delete('/api/categories/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.category.delete({ where: { id } });
      return res.json({ message: 'Categoría eliminada con éxito.' });
    } catch (err) {
      console.error('Error deleting category:', err);
      return res.status(500).json({ error: 'Error al eliminar categoría.' });
    }
  });
}
