
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { removeItem, updateQuantity, clearCart } from "@/redux/slices/cartSlice";
import BottomNav from "@/components/BottomNav";

const CartPage = () => {
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Simulate a checkout process
    setTimeout(() => {
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been placed and will be delivered soon.",
      });
      dispatch(clearCart());
      navigate("/orders");
      setIsCheckingOut(false);
    }, 2000);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pb-16">
        <div className="p-4 bg-background sticky top-0 z-10 border-b">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
        </div>
        
        <div className="flex flex-col items-center justify-center p-8 h-[70vh]">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-center mb-6">Add items from restaurants to start an order</p>
          <Button onClick={() => navigate("/")}>Browse Restaurants</Button>
        </div>
        
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="p-4 bg-background sticky top-0 z-10 border-b">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
      </div>
      
      <div className="p-4">
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center border rounded-lg p-3 bg-background">
              {item.image && (
                <div className="w-20 h-20 rounded-md overflow-hidden mr-3">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                {item.restaurantName && (
                  <p className="text-sm text-muted-foreground">from {item.restaurantName}</p>
                )}
                <p className="font-semibold mt-1">${item.price.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center">
                <button 
                  className="p-1 rounded-full hover:bg-muted" 
                  onClick={() => dispatch(updateQuantity({ itemId: item.id, quantity: item.quantity - 1 }))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="mx-2 min-w-8 text-center">{item.quantity}</span>
                <button 
                  className="p-1 rounded-full hover:bg-muted" 
                  onClick={() => dispatch(updateQuantity({ itemId: item.id, quantity: item.quantity + 1 }))}
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button 
                  className="ml-3 p-1 rounded-full text-destructive hover:bg-destructive/10"
                  onClick={() => dispatch(removeItem(item.id))}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-background rounded-lg border p-4 mb-6">
          <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>$3.99</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
            </div>
          </div>
          
          <Separator className="my-3" />
          
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${(getTotalPrice() + 3.99 + (getTotalPrice() * 0.08)).toFixed(2)}</span>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          size="lg" 
          disabled={isCheckingOut}
          onClick={handleCheckout}
        >
          {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full mt-3" 
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </Button>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default CartPage;
