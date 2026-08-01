import { defineStore } from 'pinia';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  image: string;
  specifications: Record<string, any>;
  featured: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: { products: number };
}

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    featuredProducts: [] as Product[],
    categories: [] as Category[],
    totalProducts: 0,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchCategories() {
      const config = useRuntimeConfig();
      try {
        const data = await $fetch<Category[]>(`${config.public.apiBase}/categories`);
        this.categories = data;
      } catch (err: any) {
        console.error('Error fetching categories:', err);
      }
    },
    async fetchProducts(filters: Record<string, any> = {}) {
      const config = useRuntimeConfig();
      this.loading = true;
      this.error = null;
      try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            queryParams.append(key, String(val));
          }
        });

        const res = await $fetch<{ products: Product[]; total: number }>(
          `${config.public.apiBase}/products?${queryParams.toString()}`
        );

        this.products = res.products;
        this.totalProducts = res.total;
      } catch (err: any) {
        this.error = err.data?.error || 'Error al cargar los productos.';
      } finally {
        this.loading = false;
      }
    },
    async fetchFeaturedProducts() {
      const config = useRuntimeConfig();
      try {
        const res = await $fetch<{ products: Product[] }>(
          `${config.public.apiBase}/products?featured=true&limit=6`
        );
        this.featuredProducts = res.products;
      } catch (err: any) {
        console.error('Error fetching featured products:', err);
      }
    },
    async getProductBySlugOrId(identifier: string): Promise<Product | null> {
      const config = useRuntimeConfig();
      try {
        return await $fetch<Product>(`${config.public.apiBase}/products/${identifier}`);
      } catch (err) {
        return null;
      }
    }
  }
});
