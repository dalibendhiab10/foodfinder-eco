
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, List } from 'lucide-react';
import MapView from '@/components/MapView';
import BottomNav from '@/components/BottomNav';
import { Link } from 'react-router-dom';
import FilterBar from '@/components/FilterBar';

const MapPage = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="sticky top-0 z-10 bg-background pt-4 pb-2 px-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-lg font-bold">Map View</h1>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <List size={16} />
              <span>List</span>
            </Button>
          </Link>
        </div>
        <FilterBar />
      </div>

      <div className="flex-1 overflow-hidden px-4">
        <MapView />
      </div>

      <BottomNav />
    </div>
  );
};

export default MapPage;
