export class Product {
  constructor({ id, name, slug, description, price, stock, sku, categoryId, category, image, specifications, featured, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.price = Number(price);
    this.stock = Number(stock);
    this.sku = sku;
    this.categoryId = categoryId;
    this.category = category;
    this.image = image;
    this.specifications = specifications || {};
    this.featured = Boolean(featured);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isLowStock(threshold = 10) {
    return this.stock <= threshold && this.stock > 0;
  }

  isOutOfStock() {
    return this.stock <= 0;
  }

  hasAvailableStock(quantity) {
    return this.stock >= quantity;
  }
}
