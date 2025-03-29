
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Check, ChevronDown, Filter } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';

interface FilterBarProps {
  onFilterChange?: (filters: any) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [distance, setDistance] = useState<number[]>([5]);
  const [priceRange, setPriceRange] = useState<number[]>([50]);
  const [sortBy, setSortBy] = useState("distance");
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);

  const dietaryOptions = [
    { id: "vegan", label: "Vegan" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "glutenFree", label: "Gluten Free" },
    { id: "dairyFree", label: "Dairy Free" },
    { id: "nutFree", label: "Nut Free" },
  ];

  const toggleDietaryPreference = (id: string) => {
    setDietaryPreferences(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        distance: distance[0],
        maxPrice: priceRange[0],
        sortBy,
        dietaryPreferences,
      });
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-background py-3 border-b">
      <div className="flex items-center justify-between px-4">
        <div className="flex overflow-x-auto gap-2 no-scrollbar">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-auto min-w-[120px] h-9 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Nearest</SelectItem>
              <SelectItem value="price">Price: Low to High</SelectItem>
              <SelectItem value="discount">Highest Discount</SelectItem>
              <SelectItem value="time">Ending Soon</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Filter size={16} /> 
                <span>Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div className="space-y-4">
                  <Label>Max Distance: {distance[0]} km</Label>
                  <Slider 
                    value={distance} 
                    min={1} 
                    max={20} 
                    step={1} 
                    onValueChange={setDistance} 
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Max Price: ${priceRange[0]}</Label>
                  <Slider 
                    value={priceRange} 
                    min={5} 
                    max={100} 
                    step={5} 
                    onValueChange={setPriceRange} 
                  />
                </div>

                <div className="space-y-4">
                  <Label>Dietary Preferences</Label>
                  <div className="space-y-2">
                    {dietaryOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={option.id} 
                          checked={dietaryPreferences.includes(option.id)}
                          onCheckedChange={() => toggleDietaryPreference(option.id)}
                        />
                        <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-eco-500 hover:bg-eco-600" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
