
import { useState } from "react";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/redux/hooks";
import { addItem } from "@/redux/slices/cartSlice";
import { CartItem } from "@/types/cart";

interface Food {
  id: string;
  name: string;
  price: number;
  restaurant?: {
    id: string;
    name: string;
  };
  image?: string;
}

interface AddToCartButtonProps {
  food: Food;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ food }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: food.id,
      name: food.name,
      price: food.price,
      quantity,
      image: food.image,
      restaurantId: food.restaurant?.id,
      restaurantName: food.restaurant?.name
    };
    
    dispatch(addItem(cartItem));
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${food.name} added to your cart`,
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center mb-3">
        <button 
          className="p-2 rounded-full bg-muted hover:bg-muted/80"
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="mx-4 text-lg font-medium w-6 text-center">{quantity}</span>
        <button 
          className="p-2 rounded-full bg-muted hover:bg-muted/80"
          onClick={() => setQuantity(q => q + 1)}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <Button 
        className="w-full" 
        size="lg"
        onClick={handleAddToCart}
        disabled={isAdded}
      >
        {isAdded ? (
          <>
            <Check className="mr-2 h-4 w-4" /> Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart (${(food.price * quantity).toFixed(2)})
          </>
        )}
      </Button>
    </div>
  );
};

export default AddToCartButton;
