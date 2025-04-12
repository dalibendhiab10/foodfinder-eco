
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { Order, OrderStatus } from '@/types/orders';
import { ensureOrderStatus } from '@/types/database'; // Import the helper function
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  on_the_way: 'bg-indigo-100 text-indigo-800',
  pick_up: 'bg-cyan-100 text-cyan-800',
  completed: 'bg-green-100 text-green-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            items_count:order_items(count()),
            restaurant_name:order_items(restaurants(name))
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Process and format orders
        const processedOrders: Order[] = (data || []).map((order) => ({
          ...order,
          status: ensureOrderStatus(order.status), // Convert string to OrderStatus type
          items_count: Number(order.items_count),
          restaurant_name: order.restaurant_name?.[0]?.restaurants?.name || 'Unknown Restaurant'
        }));
        
        setOrders(processedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  return (
    <div className="container mx-auto pb-16">
      <CardHeader className="pt-6">
        <CardTitle className="text-2xl font-bold">My Orders</CardTitle>
        <CardDescription>View and track all your food orders</CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You haven't placed any orders yet.</p>
            <Link to="/home" className="text-eco-500 mt-4 inline-block">
              Browse restaurants
            </Link>
          </div>
        ) : (
          <Card className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link to={`/orders/${order.id}`} className="text-eco-500 hover:underline font-medium">
                        {order.id.slice(0, 8)}...
                      </Link>
                    </TableCell>
                    <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{order.restaurant_name}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status as OrderStatus]}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </CardContent>
      
      <BottomNav />
    </div>
  );
};

export default OrdersPage;
