
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ArrowLeft, MapPin, Package, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
}

interface OrderDetail {
  id: string;
  created_at: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
  restaurant_name?: string;
  restaurant_address?: string;
  items: OrderItem[];
}

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id || !user) return;

      try {
        // First get order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (orderError) throw orderError;

        // Then get order items
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', id);

        if (itemsError) throw itemsError;

        setOrder({
          ...orderData,
          items: items
        });
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Could not load order details',
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, user, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
      case 'delivering':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="p-4 bg-background sticky top-0 z-10 border-b flex items-center">
          <Link to="/orders" className="mr-2">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Order Details</h1>
        </div>
        
        <div className="h-[80vh] flex items-center justify-center">
          <div className="animate-pulse space-y-6 w-full max-w-md px-4">
            <div className="h-10 bg-muted rounded w-3/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="space-y-3">
              <div className="h-5 bg-muted rounded w-1/2"></div>
              <div className="h-5 bg-muted rounded w-3/4"></div>
              <div className="h-5 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen">
        <div className="p-4 bg-background sticky top-0 z-10 border-b flex items-center">
          <Link to="/orders" className="mr-2">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Order Details</h1>
        </div>
        
        <div className="h-[80vh] flex flex-col items-center justify-center p-4">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order not found</h2>
          <p className="text-muted-foreground text-center mb-6">This order may have been cancelled or doesn't exist</p>
          <Button asChild>
            <Link to="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="p-4 bg-background sticky top-0 z-10 border-b flex items-center">
        <Link to="/orders" className="mr-2">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Order Details</h1>
      </div>
      
      <div className="p-4">
        <div className="rounded-lg border mb-6">
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-semibold text-lg">Order #{order.id.substring(0, 8)}</h2>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.created_at), 'MMMM d, yyyy · h:mm a')}
                </p>
              </div>
              <Badge 
                variant="outline" 
                className={`${getStatusColor(order.status)} border-0 px-3 py-1 capitalize text-xs`}
              >
                {order.status}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>Ordered on {format(new Date(order.created_at), 'MMMM d, yyyy')}</span>
              </div>
              
              {order.restaurant_name && (
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4 flex-shrink-0" />
                  <span>From {order.restaurant_name}</span>
                </div>
              )}
              
              {order.restaurant_address && (
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{order.restaurant_address}</span>
                </div>
              )}
              
              <div className="flex gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>
                  {order.status === 'completed' 
                    ? 'Delivered on ' + format(new Date(order.created_at), 'MMMM d') 
                    : 'Estimated delivery in 30-45 minutes'}
                </span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="p-4">
            <h3 className="font-medium mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">{item.quantity}×</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">${(item.unit_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="p-4">
            <h3 className="font-medium mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>${order.delivery_fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button asChild className="w-full mb-4">
          <a href={`tel:+15555555555`}>
            Contact Support
          </a>
        </Button>
        
        <Button asChild variant="outline" className="w-full">
          <Link to="/orders">
            Back to Orders
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderDetailPage;
