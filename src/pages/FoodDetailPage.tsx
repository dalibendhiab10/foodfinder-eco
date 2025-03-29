
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, MapPin, Bookmark, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { foodMockData } from '@/lib/mock-data';
import { Link, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const FoodDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  
  // Find the food item by ID
  const food = foodMockData.find(item => item.id === id);
  
  if (!food) {
    return (
      <div className="container max-w-md mx-auto pt-4 px-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div className="text-center mt-20">
          <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
          <p className="mb-6">The food item you're looking for doesn't exist.</p>
          <Link to="/">
            <Button className="bg-eco-500 hover:bg-eco-600">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const discount = Math.round(100 - (food.price.discounted / food.price.original) * 100);
  const totalPrice = (food.price.discounted * quantity).toFixed(2);
  
  const handleAddToCart = () => {
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
    <div className="container max-w-md mx-auto pb-20">
      <div className="relative">
        <img 
          src={food.image} 
          alt={food.title} 
          className="w-full h-60 object-cover"
        />
        <div className="absolute top-4 left-4 z-10">
          <Link to="/">
            <Button variant="secondary" size="icon" className="rounded-full bg-white/70 backdrop-blur-sm">
              <ArrowLeft size={20} />
            </Button>
          </Link>
        </div>
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
        {food.isFlashDeal && (
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
          <h1 className="text-2xl font-bold mb-1">{food.title}</h1>
          <p className="text-muted-foreground mb-2">{food.restaurant}</p>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{food.distance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{food.timeRemaining}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {food.tags.map((tag, index) => (
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
                  ${food.price.original.toFixed(2)}
                </span>
                <span className="text-xl font-bold">
                  ${food.price.discounted.toFixed(2)}
                </span>
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
          </div>
          
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-10">
            <div className="container max-w-md mx-auto">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="text-xl font-bold ml-2">${totalPrice}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {quantity} {quantity === 1 ? 'item' : 'items'}
                </span>
              </div>
              <Button className="w-full bg-eco-500 hover:bg-eco-600" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPage;
