
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Order, OrderItem, OrderStatus } from '@/types/orders';
import { format } from 'date-fns';

const OrderDetailPage = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!id || !user) return;

        // Fetch order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (orderError) throw orderError;
        
        // Type casting to ensure correct types
        const typedOrder: Order = {
          ...orderData,
          status: orderData.status as OrderStatus,
          order_type: orderData.order_type as 'delivery' | 'pickup' | 'dine_in'
        };
        
        setOrder(typedOrder);

        // Fetch order items with restaurant information
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            restaurants (
              name,
              logo_url
            )
          `)
          .eq('order_id', id);

        if (itemsError) throw itemsError;
        
        // Transform the selected_modifiers to be an array and ensure proper typing
        const typedItems: OrderItem[] = itemsData.map(item => ({
          ...item,
          selected_modifiers: Array.isArray(item.selected_modifiers) 
            ? item.selected_modifiers 
            : [], // Use empty array as fallback
          restaurants: item.restaurants 
            ? {
                // Use optional chaining to safely access properties
                name: item.restaurants?.name || '',
                logo_url: item.restaurants?.logo_url || ''
              } 
            : undefined
        }));
        
        setOrderItems(typedItems);
      } catch (error: any) {
        console.error('Error fetching order details:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load order details',
          description: error.message || 'Please try again later',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, user, toast]);

  const calculateSubtotal = () => {
    return orderItems.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p>Sorry, we couldn't find the order you were looking for.</p>
          <Link to="/orders" className="text-blue-500 hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Order Information</h2>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Order Date:</strong> {formatDate(order.created_at)}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Type:</strong> {order.order_type}</p>
        <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Order Items</h2>
        <ul>
          {orderItems.map((item) => (
            <li key={item.id} className="py-2 border-b border-gray-200">
              <div className="flex items-center">
                {item.restaurants?.logo_url && (
                  <img
                    src={item.restaurants.logo_url}
                    alt={item.restaurants.name}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                )}
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Price: ${item.unit_price.toFixed(2)}</p>
                  {item.special_instructions && (
                    <p className="text-sm text-gray-500">Instructions: {item.special_instructions}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <p className="font-semibold">Subtotal: ${calculateSubtotal().toFixed(2)}</p>
          <p>Tax: ${order.tax.toFixed(2)}</p>
          <p>Delivery Fee: ${order.delivery_fee.toFixed(2)}</p>
          <p className="font-bold">Total: ${order.total.toFixed(2)}</p>
        </div>
      </div>

      <Link to="/orders" className="text-blue-500 hover:underline">
        Back to Orders
      </Link>
    </div>
  );
};

export default OrderDetailPage;
