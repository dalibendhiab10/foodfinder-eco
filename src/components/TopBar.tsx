import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Filter, ShoppingBag, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { Input } from '@/components/ui/input'; // Keep Input if search functionality is added later
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useLocation, useNavigate
import { useAppSelector } from '@/redux/hooks';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NotificationBell from "@/components/NotificationBell"; // Import NotificationBell
import CartButton from './CartButton';

const TopBar = () => {
  const location = useLocation(); // Get location
  const navigate = useNavigate(); // Get navigate function

  const handleGoBack = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment); // Split and remove empty segments
    if (pathSegments.length <= 1) {
      // If we are at a top-level page (like /search, /profile) or already at /home, go to /home
      navigate('/home');
    } else {
      // Remove the last segment and navigate to the parent path
      const parentPath = '/' + pathSegments.slice(0, -1).join('/');
      navigate(parentPath);
    }
  };
  const { items } = useAppSelector(state => state.cart);

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="sticky top-0 z-30 bg-background pt-4 pb-2 px-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center"> {/* Wrapper for back button and title */}
          {!['/home', '/search', '/loyalty', '/profile'].includes(location.pathname) && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={handleGoBack} // Go to parent path
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          <h1 className="text-2xl font-bold">FoodFinder Eco</h1>
        </div>
        <div className="flex items-center gap-2">
          <CartButton /> {/* Cart button with item count */}
          <NotificationBell /> {/* Replace static notification button with NotificationBell */}
        </div>
      </div>
    </div>
  );
};

export default TopBar;