
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import FoodCard from '@/components/FoodCard';
import BottomNav from '@/components/BottomNav';
import FlashDeals from '@/components/FlashDeals';
import FilterBar from '@/components/FilterBar';
import { Link } from 'react-router-dom';
import AdBanners from '@/components/AdBanners';
// import TopBar from '@/components/TopBar'; // Removed TopBar import
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppSelector } from '@/redux/hooks';
import { getNonFlashDeals, FoodItem } from '@/services/foodService';
// Removed Popover imports as they are now in TopBar

const Index = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [regularDeals, setRegularDeals] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isMobile = useIsMobile();
  const { items } = useAppSelector(state => state.cart);
  
  // Removed getTotalItems as it's now in TopBar

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
    <div className="mx-auto  pb-20 min-h-screen bg-background"> {/* Added min-h-screen and bg-background */}
      {/* <TopBar /> */} {/* Removed TopBar usage */}

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
