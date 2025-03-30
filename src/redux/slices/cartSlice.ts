import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/cart";

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

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
