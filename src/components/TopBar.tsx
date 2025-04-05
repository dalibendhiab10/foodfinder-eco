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
          {location.pathname !== '/home' && (
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
          <Link to="/notifications" className="relative">
            <Button size="icon" variant="ghost">
              {/* Placeholder for notification count */}
              <span className="absolute -top-1 -right-1 bg-eco-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">3</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </Button>
          </Link>
        </div>
      </div>


    </div>
  );
};

export default TopBar;