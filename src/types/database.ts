
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'delivery' | 'payment' | 'system';
  is_read: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  food_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  restaurant_id: string;
  created_at: string;
}
