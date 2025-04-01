
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem } from '@/types/database';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Clock, 
  Utensils, 
  Truck, 
  Check, 
  X, 
  ShoppingBag,
  MapPin
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id || !user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (orderError) throw orderError;
        if (!orderData) {
          toast({
            variant: 'destructive',
            title: 'Order not found',
            description: 'The order you are looking for does not exist.'
          });
          navigate('/orders');
          return;
        }
        
        setOrder(orderData);
        
        // Fetch order items
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            restaurants:restaurant_id (
              name,
              location,
              image_url
            )
          `)
          .eq('order_id', id);
        
        if (itemsError) throw itemsError;
        setOrderItems(items);
        
        // Set restaurant info from the first item
        if (items.length > 0 && items[0].restaurants) {
          setRestaurant(items[0].restaurants);
        }
        
        // Subscribe to real-time updates for this order
        const channel = supabase
          .channel(`order-${id}`)
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${id}`
          }, (payload) => {
            setOrder(payload.new as Order);
          })
          .subscribe();
        
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error: any) {
        console.error('Error fetching order details:', error);
        toast({
          variant: 'destructive',
          title: 'Could not load order',
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id, user, toast, navigate]);
  
  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'on_the_way': return 3;
      case 'pick_up': return 3;
      case 'delivered': 
      case 'completed': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };
  
  const getStatusInfo = (order: Order) => {
    const isDineIn = order.order_type === 'dine_in';
    
    const steps = [
      { label: 'Order Placed', icon: Clock, isActive: getStatusStep(order.status) >= 0 },
      { label: 'Confirmed', icon: Check, isActive: getStatusStep(order.status) >= 1 },
      { label: 'Preparing', icon: Utensils, isActive: getStatusStep(order.status) >= 2 },
      { 
        label: isDineIn ? 'Ready for Pickup' : 'On the Way', 
        icon: isDineIn ? ShoppingBag : Truck, 
        isActive: getStatusStep(order.status) >= 3 
      },
      { 
        label: isDineIn ? 'Completed' : 'Delivered', 
        icon: Check, 
        isActive: getStatusStep(order.status) >= 4 
      }
    ];
    
    return {
      steps,
      isActive: order.status !== 'cancelled',
      isCancelled: order.status === 'cancelled'
    };
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen pb-16">
        <div className="p-4 bg-background sticky top-0 z-10 border-b flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Order Details</h1>
        </div>
        
        <div className="animate-pulse p-4 space-y-4">
          <div className="h-40 bg-muted rounded-lg"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="h-40 bg-muted rounded-lg"></div>
        </div>
        
        <BottomNav />
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen pb-16">
        <div className="p-4 bg-background sticky top-0 z-10 border-b flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Order Details</h1>
        </div>
        
        <div className="flex flex-col items-center justify-center p-8 h-[70vh]">
          <X className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground text-center mb-6">The order you are looking for could not be found</p>
          <Button onClick={() => navigate('/orders')}>
            View All Orders
          </Button>
        </div>
        
        <BottomNav />
      </div>
    );
  }
  
  const { steps, isActive, isCancelled } = getStatusInfo(order);
  const subtotal = orderItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  
  return (
    <div className="min-h-screen pb-16">
      <div className="p-4 bg-background sticky top-0 z-10 border-b flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate('/orders')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Order Details</h1>
      </div>
      
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Order #{order.id.substring(0, 8)}</CardTitle>
                <CardDescription>
                  {format(new Date(order.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
                </CardDescription>
              </div>
              {isCancelled && (
                <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center">
                  <X className="mr-1 h-4 w-4" />
                  Cancelled
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {restaurant && (
              <div className="mb-4 flex items-start">
                {restaurant.image_url && (
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={restaurant.image_url} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{restaurant.name}</h3>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {restaurant.location}
                  </div>
                </div>
              </div>
            )}

            {isActive && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Order Status</h3>
                <div className="relative">
                  {/* Status line */}
                  <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-muted"></div>
                  
                  {/* Status steps */}
                  <div className="space-y-6">
                    {steps.map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className={`
                          flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center z-10
                          ${step.isActive ? 'bg-eco-500 text-white' : 'bg-muted text-muted-foreground'}
                        `}>
                          <step.icon className="h-4 w-4" />
                        </div>
                        <div className="ml-3">
                          <p className={`font-medium ${step.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </p>
                          {step.isActive && index === getStatusStep(order.status) && (
                            <p className="text-sm text-muted-foreground">
                              {order.status === 'pending' && 'Waiting for restaurant to confirm'}
                              {order.status === 'confirmed' && 'Restaurant has confirmed your order'}
                              {order.status === 'preparing' && 'Your food is being prepared'}
                              {order.status === 'on_the_way' && 'Your order is on the way'}
                              {order.status === 'pick_up' && 'Your order is ready for pickup'}
                              {(order.status === 'delivered' || order.status === 'completed') && 'Enjoy your meal!'}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex-1">
                    <div className="flex">
                      <span className="text-muted-foreground mr-2">{item.quantity}x</span>
                      <span>{item.name}</span>
                    </div>
                    {item.special_instructions && (
                      <p className="text-sm text-muted-foreground ml-6">
                        Note: {item.special_instructions}
                      </p>
                    )}
                    {item.selected_modifiers && item.selected_modifiers.length > 0 && (
                      <div className="ml-6 text-sm text-muted-foreground">
                        {item.selected_modifiers.map((mod: any, index: number) => (
                          <div key={index}>
                            {mod.name}: {mod.options.join(', ')}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    ${(item.unit_price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                
                {order.delivery_fee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>${order.delivery_fee.toFixed(2)}</span>
                  </div>
                )}
                
                <Separator className="my-2" />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/orders')}
            >
              Back to Orders
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default OrderDetailPage;
