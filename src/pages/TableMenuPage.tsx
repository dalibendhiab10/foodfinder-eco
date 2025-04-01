
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FoodItem } from '@/services/foodService';
import { useAuth } from '@/contexts/AuthContext';
import { getMenuCategories, getFoodItemsByCategory, getTableById } from '@/services/restaurantService';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addItem, removeItem, updateQuantity } from '@/redux/slices/cartSlice';
import BottomNav from '@/components/BottomNav';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Minus, Plus, ShoppingBag } from 'lucide-react';

const TableMenuPage = () => {
  const { restaurantId, tableId, sessionId } = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<Record<string, FoodItem[]>>({});
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  
  // Map cart items for easier access
  const cartItemsMap = cartItems.reduce((acc, item) => {
    acc[item.id] = item.quantity;
    return acc;
  }, {} as Record<string, number>);

  useEffect(() => {
    if (!restaurantId || !tableId || !sessionId) {
      toast({
        variant: 'destructive',
        title: 'Invalid Session',
        description: 'Missing required session information.'
      });
      navigate('/');
      return;
    }
    
    const fetchMenuData = async () => {
      try {
        setIsLoading(true);
        
        // Get table information
        const table = await getTableById(tableId);
        setTableInfo(table);
        
        // Get menu categories
        const categoriesData = await getMenuCategories(restaurantId);
        setCategories(categoriesData);
        
        if (categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].id);
          
          // Load items for the first category
          const items = await getFoodItemsByCategory(categoriesData[0].id);
          setMenuItems(prev => ({
            ...prev,
            [categoriesData[0].id]: items
          }));
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load menu',
          description: 'There was a problem loading the menu. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMenuData();
  }, [restaurantId, tableId, sessionId, toast, navigate]);
  
  const handleCategoryChange = async (categoryId: string) => {
    setActiveCategory(categoryId);
    
    // Only fetch if we don't already have the items for this category
    if (!menuItems[categoryId]) {
      try {
        const items = await getFoodItemsByCategory(categoryId);
        setMenuItems(prev => ({
          ...prev,
          [categoryId]: items
        }));
      } catch (error) {
        console.error(`Error fetching items for category ${categoryId}:`, error);
        toast({
          variant: 'destructive',
          title: 'Failed to load items',
          description: 'There was a problem loading the menu items.'
        });
      }
    }
  };
  
  const handleAddToCart = (item: FoodItem) => {
    dispatch(addItem({
      id: item.id,
      name: item.title,
      price: item.discounted_price,
      quantity: 1,
      image: item.image_url || '',
      restaurantId: item.restaurant_id,
      restaurantName: item.restaurant_name || '',
      specialInstructions: '',
      tableSessionId: sessionId
    }));
    
    toast({
      title: 'Item Added',
      description: `${item.title} has been added to your cart.`
    });
  };
  
  const handleRemoveFromCart = (itemId: string) => {
    dispatch(removeItem(itemId));
  };
  
  const handleUpdateQuantity = (itemId: string, currentQuantity: number, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveFromCart(itemId);
    } else {
      dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen pb-16">
        <div className="p-4 bg-background sticky top-0 z-10 border-b">
          <h1 className="text-2xl font-bold">Loading Menu...</h1>
        </div>
        
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
        
        <BottomNav />
      </div>
    );
  }
  
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <div className="min-h-screen pb-20">
      <div className="p-4 bg-background sticky top-0 z-10 border-b">
        <h1 className="text-2xl font-bold">Restaurant Menu</h1>
        {tableInfo && (
          <p className="text-muted-foreground">
            Table {tableInfo.table_number}
          </p>
        )}
      </div>
      
      <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
        <div className="border-b sticky top-[73px] bg-background z-10">
          <div className="px-4 overflow-x-auto">
            <TabsList className="mt-2 mb-2 h-10 w-auto inline-flex whitespace-nowrap">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="px-4 py-2"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
        
        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="p-4 space-y-4">
            {menuItems[category.id]?.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex items-start p-4">
                  {item.image_url && (
                    <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 mr-4">
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center gap-3 text-sm mb-2">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">{item.time_remaining || "Available now"}</span>
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {item.tags[0]}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground line-through text-sm">
                          ${item.original_price.toFixed(2)}
                        </span>
                        <span className="text-lg font-bold text-eco-600">
                          ${item.discounted_price.toFixed(2)}
                        </span>
                      </div>
                      
                      {cartItemsMap[item.id] ? (
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, cartItemsMap[item.id], cartItemsMap[item.id] - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="mx-3 font-medium">{cartItemsMap[item.id]}</span>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, cartItemsMap[item.id], cartItemsMap[item.id] + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleAddToCart(item)}
                          className="bg-eco-500 hover:bg-eco-600"
                          size="sm"
                        >
                          Add to Order
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
      
      {totalCartItems > 0 && (
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t shadow-md">
          <Button 
            className="w-full flex items-center justify-between" 
            onClick={() => navigate(`/restaurant/${restaurantId}/table/${tableId}/checkout/${sessionId}`)}
          >
            <div className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              <span>View Order ({totalCartItems} items)</span>
            </div>
            <span>${totalPrice.toFixed(2)}</span>
          </Button>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
};

export default TableMenuPage;
