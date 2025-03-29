
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import FoodCard from '@/components/FoodCard';
import BottomNav from '@/components/BottomNav';
import { foodMockData } from '@/lib/mock-data';
import FilterBar from '@/components/FilterBar';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof foodMockData>([]);
  const [recentSearches] = useState(['bakery', 'vegan', 'pizza', 'sushi']);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // In a real app, this would call an API
    const results = foodMockData.filter(
      item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setSearchResults(results);
    setHasSearched(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
  };

  return (
    <div className="container max-w-md mx-auto pb-20">
      <div className="sticky top-0 z-10 bg-background pt-4 pb-2 px-4">
        <form onSubmit={handleSearch} className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for restaurants or food..."
            className="pl-10 pr-10 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="absolute right-3 top-3"
              onClick={clearSearch}
            >
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
        </form>
      </div>

      <div className="px-4">
        {!hasSearched ? (
          <div>
            <h2 className="text-lg font-medium mb-3">Recent Searches</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {recentSearches.map((term, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSearchQuery(term);
                    setHasSearched(true);
                    const results = foodMockData.filter(
                      item => 
                        item.title.toLowerCase().includes(term.toLowerCase()) || 
                        item.description.toLowerCase().includes(term.toLowerCase()) ||
                        item.restaurant.toLowerCase().includes(term.toLowerCase()) ||
                        item.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
                    );
                    setSearchResults(results);
                  }}
                >
                  {term}
                </Button>
              ))}
            </div>

            <h2 className="text-lg font-medium mb-3">Popular Categories</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {['Restaurant', 'Bakery', 'Grocery', 'Cafe', 'Deli', 'Vegan', 'Pizza', 'Asian'].map((category, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="h-20 flex flex-col justify-center items-center"
                  onClick={() => {
                    setSearchQuery(category);
                    setHasSearched(true);
                    const results = foodMockData.filter(
                      item => 
                        item.category === category.toLowerCase() ||
                        item.tags.some(tag => tag.toLowerCase() === category.toLowerCase())
                    );
                    setSearchResults(results);
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>

            <h2 className="text-lg font-medium mb-3">Trending Searches</h2>
            <div className="space-y-2">
              {['Dessert Collection', 'Organic Produce', 'Vegan Lunch', 'Bakery Box'].map((item, index) => (
                <Button 
                  key={index} 
                  variant="ghost" 
                  className="w-full justify-start gap-2 px-2"
                  onClick={() => {
                    setSearchQuery(item);
                    setHasSearched(true);
                    const results = foodMockData.filter(
                      food => food.title.toLowerCase().includes(item.toLowerCase())
                    );
                    setSearchResults(results);
                  }}
                >
                  <Search size={16} />
                  <span>{item}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-2 flex justify-between items-center">
              <h2 className="text-lg font-medium">Search Results</h2>
              <span className="text-sm text-muted-foreground">{searchResults.length} items</span>
            </div>
            
            <FilterBar />
            
            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any items matching "{searchQuery}"
                </p>
                <Button onClick={clearSearch} className="bg-eco-500 hover:bg-eco-600">
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 mt-4">
                {searchResults.map((food) => (
                  <FoodCard key={food.id} {...food} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default SearchPage;
