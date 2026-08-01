import { Server } from 'socket.io';

let io = null;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected to Real-Time WebSockets: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO() {
  return io;
}

export function broadcastStockUpdate(productData) {
  if (io) {
    io.emit('stock_updated', productData);
    console.log(`⚡ [Real-Time WebSocket] Broadcasted stock update for ${productData.name} (Stock: ${productData.stock})`);
  }
}

export function broadcastNewOrder(orderData) {
  if (io) {
    io.emit('new_order', orderData);
    console.log(`⚡ [Real-Time WebSocket] Broadcasted new order notification: ${orderData.orderNumber}`);
  }
}
