import { defineStore } from 'pinia';

export interface CartItem {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    image: string;
    sku: string;
  };
  quantity: number;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: (state) => state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    tax: (state) => state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) * 0.19, // 19% tax
    shipping: (state) => {
      const sub = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      if (sub === 0) return 0;
      return sub > 100 ? 0 : 9.99; // Free shipping over $100
    },
    grandTotal(): number {
      return this.subtotal + this.tax + this.shipping;
    }
  },
  actions: {
    initCart() {
      if (import.meta.client) {
        const saved = localStorage.getItem('electrotech_cart');
        if (saved) {
          try {
            this.items = JSON.parse(saved);
          } catch {
            this.items = [];
          }
        }
      }
    },
    saveCart() {
      if (import.meta.client) {
        localStorage.setItem('electrotech_cart', JSON.stringify(this.items));
      }
    },
    addItem(product: any, quantity = 1) {
      const existing = this.items.find(i => i.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty <= product.stock) {
          existing.quantity = newQty;
        } else {
          existing.quantity = product.stock;
        }
      } else {
        const qty = Math.min(quantity, product.stock);
        if (qty > 0) {
          this.items.push({
            product: {
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              stock: product.stock,
              image: product.image,
              sku: product.sku
            },
            quantity: qty
          });
        }
      }
      this.saveCart();
    },
    updateQuantity(productId: string, quantity: number) {
      const item = this.items.find(i => i.product.id === productId);
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId);
        } else {
          item.quantity = Math.min(quantity, item.product.stock);
          this.saveCart();
        }
      }
    },
    removeItem(productId: string) {
      this.items = this.items.filter(i => i.product.id !== productId);
      this.saveCart();
    },
    clearCart() {
      this.items = [];
      this.saveCart();
    }
  }
});
