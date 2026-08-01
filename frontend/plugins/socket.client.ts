import { io, Socket } from 'socket.io-client';
import { useProductStore } from '~/stores/product';

export default defineNuxtPlugin(() => {
  if (import.meta.server) return;

  const socket: Socket = io('http://localhost:3030', {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true
  });

  socket.on('connect', () => {
    console.log(`🔌 [Nuxt Client] Connected to Real-Time WebSockets Engine (ID: ${socket.id})`);
  });

  socket.on('stock_updated', (updatedProduct: any) => {
    console.log(`⚡ [Real-Time Event] Received Stock Update for ${updatedProduct.name}: ${updatedProduct.stock} units remaining.`);
    const productStore = useProductStore();

    // Update in products list
    const index = productStore.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      productStore.products[index].stock = updatedProduct.stock;
      if (updatedProduct.price) productStore.products[index].price = updatedProduct.price;
    }

    // Update in featured products
    const featIndex = productStore.featuredProducts.findIndex(p => p.id === updatedProduct.id);
    if (featIndex !== -1) {
      productStore.featuredProducts[featIndex].stock = updatedProduct.stock;
    }
  });

  socket.on('new_order', (newOrder: any) => {
    console.log(`⚡ [Real-Time Event] New Order Received: ${newOrder.orderNumber} ($${newOrder.totalAmount})`);
  });

  return {
    provide: {
      socket
    }
  };
});
