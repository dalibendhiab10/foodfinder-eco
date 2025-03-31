
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import FoodCard from '@/components/FoodCard';
import BottomNav from '@/components/BottomNav';
import FlashDeals from '@/components/FlashDeals';
import FilterBar from '@/components/FilterBar';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import AdBanners from '@/components/AdBanners';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppSelector } from '@/redux/hooks';
import { getNonFlashDeals, FoodItem } from '@/services/foodService';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Index = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [regularDeals, setRegularDeals] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isMobile = useIsMobile();
  const { items } = useAppSelector(state => state.cart);
  
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    const fetchRegularDeals = async () => {
      try {
        setIsLoading(true);
        const deals = await getNonFlashDeals();
        setRegularDeals(deals);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch regular deals:', err);
        setError('Failed to load deals. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegularDeals();
  }, []);

  return (
    <div className="container max-w-md mx-auto pb-20 sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
      <div className="sticky top-0 z-30 bg-background pt-4 pb-2 px-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">FoodFinder Eco</h1>
            <p className="text-sm text-muted-foreground">Save food, save money, save the planet</p>
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
                <span className="absolute -top-1 -right-1 bg-eco-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">3</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="relative mb-4 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for restaurants or food..."
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Filter size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="end">
              <div className="flex gap-2 overflow-x-auto flex-wrap p-3">
                <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">All</Button>
                <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">Restaurant</Button>
                <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">Bakery</Button>
                <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">Grocery</Button>
                <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">Cafe</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="px-4">
        <AdBanners />
        
        <FlashDeals />
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3 pt-2">
            <h2 className="text-xl font-bold">Nearby Deals</h2>
            <Link to="/map" className="text-eco-500 text-sm">View Map</Link>
          </div>
          <FilterBar />
          
          {isLoading && (
            <div className="py-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-eco-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading deals...</p>
            </div>
          )}
          
          {error && (
            <div className="py-8 text-center">
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          )}
          
          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
              {regularDeals.map((food) => (
                <FoodCard 
                  key={food.id} 
                  id={food.id}
                  title={food.title}
                  description={food.description}
                  price={{
                    original: food.original_price,
                    discounted: food.discounted_price
                  }}
                  image={food.image_url || ''}
                  restaurant={food.restaurant_name || ''}
                  distance={food.distance || ''}
                  timeRemaining={food.time_remaining || ''}
                  tags={food.tags || []}
                  isFlashDeal={food.is_flash_deal}
                />
              ))}
            </div>
          )}
          
          {!isLoading && !error && regularDeals.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No deals available at the moment. Check back later!</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
