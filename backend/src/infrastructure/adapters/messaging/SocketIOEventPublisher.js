import { EventPublisherPort } from '../../../domain/ports/EventPublisherPort.js';
import { broadcastStockUpdate, broadcastNewOrder } from '../../../socket.js';

export class SocketIOEventPublisher extends EventPublisherPort {
  publishStockUpdate(productData) {
    broadcastStockUpdate(productData);
  }

  publishNewOrder(orderData) {
    broadcastNewOrder(orderData);
  }
}
