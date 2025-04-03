
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Order, OrderStatus } from '@/types/orders';
import { format } from 'date-fns';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user) return;

        // Attempt to use RPC function if it exists
        let ordersData: Order[] = [];
        
        try {
          const { data: rpcData, error: rpcError } = await supabase
            .rpc('get_orders_with_details', {
              user_id_param: user.id
            });

          if (rpcError) throw rpcError;
          
          // Process RPC results if successful
          ordersData = (rpcData || []).map(order => ({
            ...order,
            status: order.status as OrderStatus,
            order_type: order.order_type as 'delivery' | 'pickup' | 'dine_in'
          }));
        } catch (rpcError) {
          console.error('RPC function error, falling back to direct query:', rpcError);
          
          // Fallback to direct query if RPC is not available
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (fallbackError) throw fallbackError;
          
          // Type casting for fallback data
          ordersData = (fallbackData || []).map(order => ({
            ...order,
            status: order.status as OrderStatus,
            order_type: order.order_type as 'delivery' | 'pickup' | 'dine_in'
          }));
        }

        setOrders(ordersData);
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load orders',
          description: error.message || 'Please try again later',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, toast]);

  const renderOrderStatus = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="text-gray-500">Pending</span>;
      case 'confirmed':
        return <span className="text-blue-500">Confirmed</span>;
      case 'preparing':
        return <span className="text-yellow-500">Preparing</span>;
      case 'on_the_way':
        return <span className="text-purple-500">On the way</span>;
      case 'pick_up':
        return <span className="text-orange-500">Ready for Pickup</span>;
      case 'completed':
        return <span className="text-green-500">Completed</span>;
      case 'delivered':
        return <span className="text-green-500">Delivered</span>;
      case 'cancelled':
        return <span className="text-red-500">Cancelled</span>;
      default:
        return <span className="text-gray-500">Unknown</span>;
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-500">No orders yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{order.id}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {format(new Date(order.created_at), 'MMM dd, yyyy')}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {renderOrderStatus(order.status)}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      ${order.total.toFixed(2)}
                    </p>
                  </td>
                   <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {order.items_count || 'N/A'}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <Link to={`/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
