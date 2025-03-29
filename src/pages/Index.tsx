
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import FoodCard from '@/components/FoodCard';
import BottomNav from '@/components/BottomNav';
import FlashDeals from '@/components/FlashDeals';
import FilterBar from '@/components/FilterBar';
import { foodMockData } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import AdBanners from '@/components/AdBanners';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  // Filter the food data to exclude flash deals for the regular listing
  const regularDeals = foodMockData.filter(item => !item.isFlashDeal);
  const isMobile = useIsMobile();

  return (
    <div className="container max-w-md mx-auto pb-20 sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
      <div className="sticky top-0 z-30 bg-background pt-4 pb-2 px-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">FoodFinder Eco</h1>
            <p className="text-sm text-muted-foreground">Save food, save money, save the planet</p>
          </div>
          <Link to="/notification" className="relative">
            <Button size="icon" variant="ghost">
              <span className="absolute -top-1 -right-1 bg-eco-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">3</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </Button>
          </Link>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for restaurants or food..."
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2">
          <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">All</Button>
          <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">Restaurant</Button>
          <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">Bakery</Button>
          <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">Grocery</Button>
          <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">Cafe</Button>
        </div>
      </div>

      <div className="px-4">
        {/* Ad Banners */}
        <AdBanners />
        
        <FlashDeals />
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3 pt-2">
            <h2 className="text-xl font-bold">Nearby Deals</h2>
            <Link to="/map" className="text-eco-500 text-sm">View Map</Link>
          </div>
          <FilterBar />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {regularDeals.map((food) => (
              <FoodCard key={food.id} {...food} />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
