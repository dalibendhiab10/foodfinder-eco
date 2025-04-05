
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import FoodCard from '@/components/FoodCard';
import BottomNav from '@/components/BottomNav';
import FilterBar from '@/components/FilterBar';
import { searchFoodItems, FoodItem } from '@/services/foodService';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [recentSearches] = useState(['bakery', 'vegan', 'pizza', 'sushi']);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      const results = await searchFoodItems(searchQuery);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = async (term: string) => {
    try {
      setSearchQuery(term);
      setIsLoading(true);
      const results = await searchFoodItems(term);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
  };

  return (
    <div className="container max-w-md mx-auto pt-20 pb-20"> {/* Added pt-20 */}
      {/* Removed sticky header div, kept form */}
      <form onSubmit={handleSearch} className="relative mb-4 px-4"> {/* Added px-4 here */}
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

      <div className="px-4">
        {isLoading && (
          <div className="py-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-eco-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Searching...</p>
          </div>
        )}

        {!isLoading && !hasSearched ? (
          <div>
            <h2 className="text-lg font-medium mb-3">Recent Searches</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {recentSearches.map((term, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm" 
                  onClick={() => performSearch(term)}
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
                  onClick={() => performSearch(category)}
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
                  onClick={() => performSearch(item)}
                >
                  <Search size={16} />
                  <span>{item}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : !isLoading && (
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
                  <FoodCard 
                    key={food.id} 
                    id={food.id}
                    title={food.title}
                    description={food.description}
                    price={{
                      original: food.original_price,
                      discounted: food.discounted_price
                    }}
                    image={food.image_url || ''}
                    restaurant={food.restaurant_name || ''}
                    distance={food.distance || ''}
                    timeRemaining={food.time_remaining || ''}
                    tags={food.tags || []}
                    isFlashDeal={food.is_flash_deal}
                  />
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
