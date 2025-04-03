
export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'on_the_way' 
  | 'pick_up' 
  | 'completed' 
  | 'delivered' 
  | 'cancelled';

export type OrderType = 'delivery' | 'pickup' | 'dine_in';

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  restaurant_table_id: string | null;
  order_type: OrderType;
  is_paid: boolean;
  restaurant_name?: string;
  items_count?: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  food_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  special_instructions: string;
  restaurant_id: string;
  created_at: string;
  table_session_id: string | null;
  selected_modifiers: any[];
  restaurants?: {
    name: string;
    logo_url: string;
  };
}
