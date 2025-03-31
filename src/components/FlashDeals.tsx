
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import FoodCard from './FoodCard';
import { getFlashDeals, FoodItem } from '@/services/foodService';
import { AlertTriangle } from 'lucide-react';

const FlashDeals = () => {
  const [flashDeals, setFlashDeals] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        setIsLoading(true);
        const deals = await getFlashDeals();
        setFlashDeals(deals);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch flash deals:', err);
        setError('Failed to load flash deals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashDeals();
  }, []);

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">⚡ Flash Deals</h2>
          <a href="/flash-deals" className="text-eco-500 text-sm">See All</a>
        </div>
        <div className="py-8 text-center">
          <div className="animate-pulse h-40 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">⚡ Flash Deals</h2>
          <a href="/flash-deals" className="text-eco-500 text-sm">See All</a>
        </div>
        <div className="bg-muted p-4 rounded-lg flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
          <span className="text-muted-foreground">Unable to load flash deals</span>
        </div>
      </div>
    );
  }

  if (flashDeals.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">⚡ Flash Deals</h2>
          <a href="/flash-deals" className="text-eco-500 text-sm">See All</a>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-muted-foreground">No flash deals available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">⚡ Flash Deals</h2>
        <a href="/flash-deals" className="text-eco-500 text-sm">See All</a>
      </div>
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex space-x-4 px-1">
          {flashDeals.map((deal) => (
            <div key={deal.id} className="w-[250px] sm:w-[280px] md:w-[300px] inline-block">
              <FoodCard
                id={deal.id}
                title={deal.title}
                description={deal.description}
                price={{
                  original: deal.original_price,
                  discounted: deal.discounted_price
                }}
                image={deal.image_url || ''}
                restaurant={deal.restaurant_name || ''}
                distance={deal.distance || ''}
                timeRemaining={deal.time_remaining || ''}
                tags={deal.tags || []}
                isFlashDeal={true}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FlashDeals;
