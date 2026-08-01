import prisma from '../../../prisma.js';
import { Product } from '../../../domain/entities/Product.js';
import { ProductRepositoryPort } from '../../../domain/ports/ProductRepositoryPort.js';

export class PrismaProductRepository extends ProductRepositoryPort {
  async findAll(filters = {}) {
    const { search, categoryId, minPrice, maxPrice, inStock, featured, limit = 50, page = 1 } = filters;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }
    if (featured === 'true') {
      where.featured = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [productsData, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.product.count({ where })
    ]);

    const products = productsData.map(p => new Product(p));

    return {
      products,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    };
  }

  async findByIdOrSlug(identifier) {
    const productData = await prisma.product.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ]
      },
      include: { category: true }
    });

    return productData ? new Product(productData) : null;
  }

  async create(data) {
    const created = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        price: parseFloat(data.price),
        stock: parseInt(data.stock || 0),
        sku: data.sku,
        categoryId: data.categoryId,
        image: data.image,
        specifications: data.specifications || {},
        featured: Boolean(data.featured)
      },
      include: { category: true }
    });

    return new Product(created);
  }

  async update(id, data) {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: parseFloat(data.price) }),
        ...(data.stock !== undefined && { stock: parseInt(data.stock) }),
        ...(data.sku && { sku: data.sku }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.image && { image: data.image }),
        ...(data.specifications !== undefined && { specifications: data.specifications }),
        ...(data.featured !== undefined && { featured: Boolean(data.featured) })
      },
      include: { category: true }
    });

    return new Product(updated);
  }

  async delete(id) {
    await prisma.product.delete({ where: { id } });
    return true;
  }
}
