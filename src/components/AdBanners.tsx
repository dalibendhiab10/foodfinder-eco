import React, { useState, useEffect } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from '@/components/ui/carousel';
import AdBanner from './AdBanner';

// Expanded mock data for ad banners
const adBannersData = [
  {
    id: 1,
    title: "Save 20% on your first order",
    description: "Use code ECO20 at checkout to save on your first purchase",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=400"
  },
  {
    id: 2,
    title: "Eco hero rewards program",
    description: "Save food, earn points, get exclusive rewards",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=400"
  },
  {
    id: 3,
    title: "Refer a friend, get $10",
    description: "Invite your friends to join FoodFinder Eco and earn rewards",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=400"
  },
  {
    id: 4,
    title: "Sustainable Shopping Made Easy",
    description: "Discover eco-friendly options from local businesses",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&h=400"
  },
  {
    id: 5,
    title: "Weekend Flash Deals",
    description: "Special weekend offers on selected items",
    image: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=800&h=400"
  }
];

const AdBanners = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % adBannersData.length);
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="relative mb-6">
      <Carousel className="w-full" activeIndex={currentBanner}>
        <CarouselContent>
          {adBannersData.map((banner, index) => (
            <CarouselItem key={banner.id} isActive={index === currentBanner}>
              <AdBanner {...banner} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {adBannersData.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentBanner 
                  ? "w-4 bg-white" 
                  : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default AdBanners;
