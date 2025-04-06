import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  restaurant_name: string;
  restaurant_id: string;
  order_items: {
    food_title: string;
    quantity: number;
  }[];
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fix the TypeScript error related to fetching orders
  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.rpc('get_user_orders', {
        user_id: user.id
      });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      return data || [];
    } catch (err) {
      console.error('Error in fetchOrders:', err);
      return [];
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
      } catch (e: any) {
        setError(e.message || 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-lg font-semibold">{order.restaurant_name}</h2>
                  <p className="text-gray-500">
                    Order Date: {format(new Date(order.created_at), 'MMMM dd, yyyy hh:mm a')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Total: ${order.total_amount.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <h3 className="text-md font-semibold">Order Items:</h3>
                <ul>
                  {order.order_items.map((item, index) => (
                    <li key={index} className="text-gray-700">
                      {item.food_title} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to={`/orders/${order.id}`}>
                <Button className="mt-4">View Details</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
