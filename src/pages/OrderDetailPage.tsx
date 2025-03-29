
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ordersMockData } from '@/lib/mock-data';
import { Link, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Find the order by ID
  const order = ordersMockData.find(o => o.id === id);
  
  if (!order) {
    return (
      <div className="container max-w-md mx-auto pt-4 px-4">
        <Link to="/orders">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div className="text-center mt-20">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="mb-6">The order you're looking for doesn't exist.</p>
          <Link to="/orders">
            <Button className="bg-eco-500 hover:bg-eco-600">Return to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const handleContactStore = () => {
    toast({
      title: "Contact Restaurant",
      description: "Calling the restaurant...",
    });
  };
  
  const handleCancelOrder = () => {
    toast({
      title: "Cancel Order",
      description: "Your order has been canceled and refunded.",
    });
  };
  
  return (
    <div className="container max-w-md mx-auto pb-6">
      <div className="sticky top-0 z-10 bg-background pt-4 pb-2 px-4">
        <div className="flex items-center mb-4">
          <Link to="/orders">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Order #{order.id.slice(0, 8)}</h1>
        </div>
      </div>
      
      <div className="px-4">
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="font-bold mb-2">Order Status</h2>
            
            <div className="relative mb-6">
              <div className="flex items-center justify-between mb-2">
                {order.trackingSteps.map((step, index) => (
                  <div 
                    key={step.id} 
                    className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                      step.completed ? 'bg-eco-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.completed ? '✓' : index + 1}
                  </div>
                ))}
              </div>
              
              <div className="absolute top-3 left-3 right-3 h-[2px] bg-gray-200 -z-0"></div>
              
              <div className="flex items-center justify-between text-xs">
                {order.trackingSteps.map((step) => (
                  <div key={step.id} className="text-center w-16">
                    <p className={step.completed ? 'font-medium' : 'text-muted-foreground'}>
                      {step.name}
                    </p>
                    {step.time && (
                      <p className="text-muted-foreground mt-1">{step.time}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-eco-50 p-3 rounded-lg mb-4">
              <p className="text-center">
                <span className="font-medium">Estimated Pickup:</span> {order.estimatedPickupTime}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex gap-2 items-center"
                onClick={handleContactStore}
              >
                <Phone size={16} />
                <span>Contact Store</span>
              </Button>
              <Link to={`https://maps.google.com/?q=${order.restaurantAddress}`} target="_blank">
                <Button
                  variant="outline"
                  className="w-full flex gap-2 items-center"
                >
                  <MapPin size={16} />
                  <span>View Location</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="font-bold mb-3">Order Details</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Restaurant</p>
                <p className="font-medium">{order.restaurant}</p>
                <p className="text-sm">{order.restaurantAddress}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Items</p>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <p>{item.quantity}x {item.name}</p>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <p>Subtotal</p>
                  <p>${order.total.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <p>Service Fee</p>
                  <p>$0.00</p>
                </div>
                <div className="flex justify-between items-center font-bold mt-2">
                  <p>Total</p>
                  <p>${order.total.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p>Visa •••• 4242</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p>{order.date}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Button 
            variant="ghost" 
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleCancelOrder}
          >
            Cancel Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
