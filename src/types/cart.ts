
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  restaurantId?: string;
  restaurantName?: string;
  selectedModifiers?: any[];
  specialInstructions?: string;
  tableSessionId?: string;
}
