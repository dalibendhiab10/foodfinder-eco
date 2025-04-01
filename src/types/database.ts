// Add or extend the existing type definitions
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'on_the_way' | 'pick_up' | 'completed' | 'delivered' | 'cancelled';

export type NotificationType = 'order' | 'promotion' | 'delivery' | 'payment' | 'system';

export interface RestaurantTable {
  id: string;
  restaurant_id: string;
  table_number: string;
  qr_code?: string;
  is_active: boolean;
  created_at: string;
}

export interface TableSession {
  id: string;
  table_id: string;
  restaurant_id: string;
  user_id?: string;
  session_code: string;
  status: string;
  started_at: string;
  ended_at?: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ItemModifier {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  options: any[];
  is_multiple: boolean;
  is_required: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  restaurant_table_id?: string;
  table_session_id?: string;
  order_type?: string;
  is_paid?: boolean;
}

export interface OrderItem {
  id: string;
  order_id: string;
  food_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  restaurant_id: string;
  special_instructions?: string;
  selected_modifiers: any[];
  table_session_id?: string;
  created_at: string;
  restaurants?: any;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}
