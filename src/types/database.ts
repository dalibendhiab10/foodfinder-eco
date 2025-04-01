
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
  status: 'pending' | 'confirmed' | 'preparing' | 'on_the_way' | 'pick_up' | 'completed' | 'delivered' | 'cancelled';
  created_at: string;
  order_items?: OrderItem[];
  order_type?: string;
  restaurant_table_id?: string;
  table_session_id?: string;
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
  created_at: string;
  selected_modifiers?: any[];
  special_instructions?: string;
  table_session_id?: string;
}

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
  status: 'active' | 'ended';
  started_at: string;
  ended_at?: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  sort_order?: number;
  is_active: boolean;
  created_at: string;
}

export interface ItemModifier {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  options?: any[];
  is_multiple: boolean;
  is_required: boolean;
  created_at: string;
}
