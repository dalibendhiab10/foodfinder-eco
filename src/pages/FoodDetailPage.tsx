
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, MapPin, Bookmark, Share2, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import NotificationBell from '@/components/NotificationBell';
import { useAppDispatch } from '@/redux/hooks';
import { addItem } from '@/redux/slices/cartSlice';
import { getFoodItemById, FoodItem } from '@/services/foodService';

const FoodDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [food, setFood] = useState<FoodItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFoodItem = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const foodItem = await getFoodItemById(id);
        setFood(foodItem);
        if (!foodItem) {
          setError('Food item not found');
        }
      } catch (err) {
        console.error('Error fetching food item:', err);
        setError('Failed to load food item details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFoodItem();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto pt-16 px-4 sm:max-w-2xl lg:max-w-4xl">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-eco-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading food details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !food) {
    return (
      <div className="container max-w-md mx-auto pt-4 px-4 sm:max-w-2xl lg:max-w-4xl">
        <Link to="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div className="text-center mt-20">
          <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
          <p className="mb-6">The food item you're looking for doesn't exist or couldn't be loaded.</p>
          <Link to="/">
            <Button className="bg-eco-500 hover:bg-eco-600">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const discount = Math.round(100 - (food.discounted_price / food.original_price) * 100);
  const totalPrice = (food.discounted_price * quantity).toFixed(2);
  
  const handleAddToCart = () => {
    dispatch(addItem({
      id: food.id,
      name: food.title,
      price: food.discounted_price,
      quantity: quantity,
      image: food.image_url || '',
      restaurantId: food.restaurant_id,
      restaurantName: food.restaurant_name || ''
    }));
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${food.title} added to your cart`,
    });
  };
  
  const handleSaveForLater = () => {
    toast({
      title: "Saved for later",
      description: `${food.title} has been saved to your favorites`,
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Share this deal",
      description: "Sharing options would appear here",
    });
  };
  
  return (
    <div className="container max-w-md mx-auto pb-20 sm:max-w-2xl lg:max-w-4xl">
      <div className="sticky top-0 z-30 bg-background pt-4 pb-2 px-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">{food.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingBag size={20} />
              </Button>
            </Link>
            <Link to="/notifications">
              <NotificationBell />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative">
        <img 
          src={food.image_url || ''} 
          alt={food.title} 
          className="w-full h-60 object-cover sm:h-72 lg:h-96"
        />
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full bg-white/70 backdrop-blur-sm"
            onClick={handleSaveForLater}
          >
            <Bookmark size={20} />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full bg-white/70 backdrop-blur-sm"
            onClick={handleShare}
          >
            <Share2 size={20} />
          </Button>
        </div>
        {food.is_flash_deal && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-eco-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Flash Deal
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-eco-600 text-white px-2 py-1 rounded-md">
          {discount}% OFF
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold mb-1">{food.title}</h1>
          </div>
          <p className="text-muted-foreground mb-2">{food.restaurant_name}</p>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{food.distance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{food.time_remaining}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {food.tags && food.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-eco-100 text-eco-800 border-eco-200">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{food.description}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Pickup Information</h2>
            <p className="text-muted-foreground mb-2">
              Available for pickup during the time window shown above. Please bring your own bags if possible.
            </p>
            <Button variant="outline" className="w-full">
              <MapPin size={16} className="mr-2" />
              View Restaurant Location
            </Button>
          </div>
          
          <div className="border-t border-b py-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-muted-foreground line-through text-sm mr-2">
                  ${food.original_price.toFixed(2)}
                </span>
                <span className="text-xl font-bold">
                  ${food.discounted_price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-10">
        <div className="container max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl">
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="text-xl font-bold ml-2">${totalPrice}</span>
            </div>
            <div className="flex items-center border rounded-md">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10"
                onClick={() => setQuantity(Math.min(food.quantity, quantity + 1))}
                disabled={quantity >= food.quantity}
              >
                +
              </Button>
            </div>
          </div>
          <Button className="w-full bg-eco-500 hover:bg-eco-600" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPage;
