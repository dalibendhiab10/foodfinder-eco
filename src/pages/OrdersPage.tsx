
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Dot, ExternalLink, ShoppingBag } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { ordersMockData, userMockData } from '@/lib/mock-data';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const activeOrders = ordersMockData;
  const pastOrders = userMockData.orderHistory;
  
  return (
    <div className="container max-w-md mx-auto pb-20">
      <div className="sticky top-0 z-10 bg-background pt-4 pb-2 px-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Your Orders</h1>
          <p className="text-sm text-muted-foreground">Track your current and past orders</p>
        </div>
      </div>
      
      <div className="px-4">
        <Tabs defaultValue="active" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="past">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No active orders</h3>
                <p className="text-muted-foreground mb-4">You don't have any active orders right now.</p>
                <Link to="/">
                  <Button className="bg-eco-500 hover:bg-eco-600">Browse Deals</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {activeOrders.map((order) => (
                  <Link key={order.id} to={`/orders/${order.id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{order.restaurant}</h3>
                            <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                          </div>
                          <div className="flex items-center">
                            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'preparing' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              <Dot size={16} />
                              <span>
                                {order.status === 'preparing' ? 'Preparing' : 'Ready for pickup'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-2 mt-2">
                          <p className="text-sm mb-1">
                            <span className="font-medium">Pickup time:</span> {order.estimatedPickupTime}
                          </p>
                          <div className="text-sm mb-2">
                            <span className="font-medium">Items:</span>{' '}
                            {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="font-medium">${order.total.toFixed(2)}</div>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-eco-600">
                              <span>Track Order</span>
                              <ExternalLink size={14} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No order history</h3>
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                <Link to="/">
                  <Button className="bg-eco-500 hover:bg-eco-600">Browse Deals</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {pastOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{order.restaurant}</h3>
                          <p className="text-sm text-muted-foreground">
                            Order #{order.id.slice(0, 8)} • {order.date}
                          </p>
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                          Completed
                        </div>
                      </div>
                      
                      <div className="border-t pt-2 mt-2">
                        <div className="text-sm mb-2">
                          <span className="font-medium">Items:</span>{' '}
                          {order.items.join(', ')}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="font-medium">${order.total.toFixed(2)}</div>
                          <Button variant="ghost" size="sm" className="text-eco-600">
                            Order Again
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default OrdersPage;
