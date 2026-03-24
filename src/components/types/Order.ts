export type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
};

export type Order = {
  id: number;
  customerName: string;
  customerType: 'individual' | 'legal_entity';
  phoneNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
};
