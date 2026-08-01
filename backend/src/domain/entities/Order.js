export class OrderItem {
  constructor({ id, orderId, productId, product, quantity, unitPrice, totalPrice }) {
    this.id = id;
    this.orderId = orderId;
    this.productId = productId;
    this.product = product;
    this.quantity = Number(quantity);
    this.unitPrice = Number(unitPrice);
    this.totalPrice = Number(totalPrice || (quantity * unitPrice));
  }
}

export class Order {
  constructor({ id, orderNumber, userId, user, status, totalAmount, shippingAddress, paymentMethod, items, createdAt, updatedAt }) {
    this.id = id;
    this.orderNumber = orderNumber;
    this.userId = userId;
    this.user = user;
    this.status = status || 'PENDING';
    this.totalAmount = Number(totalAmount);
    this.shippingAddress = shippingAddress;
    this.paymentMethod = paymentMethod;
    this.items = (items || []).map(item => new OrderItem(item));
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isPaid() {
    return this.status === 'PAID';
  }
}
