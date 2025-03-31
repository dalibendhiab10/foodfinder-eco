
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/cart";
import { supabase } from "@/integrations/supabase/client";

interface CartState {
  items: CartItem[];
}

// Initialize state from localStorage if available
const loadCartFromStorage = (): CartState => {
  if (typeof window === "undefined") return { items: [] };
  
  try {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? { items: JSON.parse(savedCart) } : { items: [] };
  } catch (error) {
    console.error("Failed to parse cart data from localStorage", error);
    return { items: [] };
  }
};

const initialState: CartState = loadCartFromStorage();

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      
      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        state.items[existingItemIndex].quantity += action.payload.quantity || 1;
      } else {
        // Otherwise add new item
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }
      
      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    
    updateQuantity: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) => {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== itemId);
      } else {
        const item = state.items.find((item) => item.id === itemId);
        if (item) {
          item.quantity = quantity;
        }
      }
      
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
  },
});

// Create an order in Supabase
export const createOrder = async (items: CartItem[], userId: string) => {
  try {
    // Calculate total amount
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = 3.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;
    
    // Create order in Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        subtotal,
        delivery_fee: deliveryFee,
        tax,
        total,
        status: 'pending'
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      food_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      restaurant_id: item.restaurantId,
      name: item.name
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error };
  }
};

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
