
import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import AdBanner from './AdBanner';

// Mock data for ad banners
const adBannersData = [
  {
    id: 1,
    title: "Save 20% on your first order",
    description: "Use code ECO20 at checkout to save on your first purchase",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=400",
    ctaText: "Get Started",
    ctaLink: "/auth"
  },
  {
    id: 2,
    title: "Eco hero rewards program",
    description: "Save food, earn points, get exclusive rewards",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=400",
    ctaText: "Join Now",
    ctaLink: "/profile"
  },
  {
    id: 3,
    title: "Refer a friend, get $10",
    description: "Invite your friends to join FoodFinder Eco and earn rewards",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=400",
    ctaText: "Refer Now",
    ctaLink: "/profile"
  }
];

const AdBanners = () => {
  return (
    <Carousel className="mb-6">
      <CarouselContent>
        {adBannersData.map((banner) => (
          <CarouselItem key={banner.id}>
            <AdBanner {...banner} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default AdBanners;
