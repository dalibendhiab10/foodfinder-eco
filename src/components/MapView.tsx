
import React from 'react';
import { MapPin } from 'lucide-react';

// Mock map implementation - in a real app this would use Google Maps or similar
const MapView = () => {
  return (
    <div className="relative h-[calc(100vh-200px)] w-full bg-gray-200 map-container">
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <MapPin size={32} className="text-eco-500" />
        <p className="text-center mt-4">
          Map view would integrate with Google Maps API here
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Show nearby restaurants and food deals
        </p>
      </div>
      <div className="absolute bottom-4 right-4">
        <button className="bg-white p-2 rounded-full shadow-md">
          <MapPin size={24} className="text-eco-500" />
        </button>
      </div>
    </div>
  );
};

export default MapView;
