import React from 'react';
import { Card } from '@/components/ui/card';

interface AdBannerProps {
  title: string;
  description: string;
  image: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  title, 
  description, 
  image 
}) => {
  return (
    <Card className="overflow-hidden mb-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-[120px] sm:h-[150px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-white/90 mb-2 line-clamp-2">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default AdBanner;
