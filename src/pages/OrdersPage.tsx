
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, Check, X, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  restaurant_name?: string;
  items_count: number;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            total,
            status,
            order_items!inner (count)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match our interface
        const formattedOrders = data.map(order => ({
          id: order.id,
          created_at: order.created_at,
          total: order.total,
          status: order.status,
          items_count: order.order_items[0]?.count || 0
        }));

        setOrders(formattedOrders);
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Could not load orders',
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'preparing':
      case 'delivering':
        return <Package className="h-5 w-5" />;
      case 'completed':
        return <Check className="h-5 w-5" />;
      case 'cancelled':
        return <X className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

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
      <div className="min-h-screen pb-16">
        <div className="p-4 bg-background sticky top-0 z-10 border-b">
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>
        
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-pulse space-y-4 w-full max-w-md">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
        
        <BottomNav />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen pb-16">
        <div className="p-4 bg-background sticky top-0 z-10 border-b">
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>
        
        <div className="flex flex-col items-center justify-center p-8 h-[70vh]">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground text-center mb-6">When you place orders, they will appear here</p>
          <Button asChild>
            <Link to="/">Browse Restaurants</Link>
          </Button>
        </div>
        
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="p-4 bg-background sticky top-0 z-10 border-b">
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {orders.map((order) => (
            <Link 
              key={order.id} 
              to={`/orders/${order.id}`}
              className="block border rounded-lg p-4 bg-background hover:bg-muted/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">Order #{order.id.substring(0, 8)}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), 'MMM d, yyyy · h:mm a')}
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(order.status)} border-0 capitalize`}
                >
                  <span className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </Badge>
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">
                    {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                  </div>
                  <div className="font-semibold">${order.total.toFixed(2)}</div>
                </div>
                <div className="text-eco-500">
                  <ArrowRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default OrdersPage;
