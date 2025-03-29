
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import FoodCard from './FoodCard';
import { foodMockData } from '@/lib/mock-data';

const FlashDeals = () => {
  // Filter for flash deals only
  const flashDeals = foodMockData.filter(item => item.isFlashDeal).slice(0, 5);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">⚡ Flash Deals</h2>
        <a href="/flash-deals" className="text-eco-500 text-sm">See All</a>
      </div>
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex space-x-4 px-1">
          {flashDeals.map((deal) => (
            <div key={deal.id} className="w-[250px] inline-block">
              <FoodCard {...deal} isFlashDeal={true} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FlashDeals;
