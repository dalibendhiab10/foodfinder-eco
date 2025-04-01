
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks";

const CartButton = () => {
  const { items } = useAppSelector(state => state.cart);
  
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  
  return (
    <Link to="/cart" className="relative">
      <Button size="icon" variant="ghost">
        {getTotalItems() > 0 && (
          <span className="absolute -top-1 -right-1 bg-eco-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {getTotalItems() > 9 ? '9+' : getTotalItems()}
          </span>
        )}
        <ShoppingBag className="h-5 w-5" />
      </Button>
    </Link>
  );
};

export default CartButton;
