
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchMerchantProfile, MerchantProfile } from '@/services/merchantService';
import { FoodItem, getAllFoodItems } from '@/services/foodService';
import MerchantNav from '@/components/merchant/MerchantNav';
import { Order } from '@/types/orders';
import { ensureOrderStatus, ensureOrderType } from '@/types/database'; // Import both helper functions
import { supabase } from '@/integrations/supabase/client';
import { ShoppingBag, Package, TrendingUp } from 'lucide-react';

const MerchantDashboardPage = () => {
  const [profile, setProfile] = useState<MerchantProfile | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadMerchantData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const merchantProfile = await fetchMerchantProfile();
        
        if (!merchantProfile) {
          toast({
            variant: "destructive",
            title: "Merchant profile not found",
            description: "Please create a merchant profile to continue.",
          });
          return;
        }
        
        setProfile(merchantProfile);
        
        // Load merchant food items
        const items = await getAllFoodItems();
        setFoodItems(items.filter(item => item.restaurant_id === merchantProfile.id));
        
        // Load merchant orders - Use a simple query to avoid deep type instantiation
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select(`
            id, 
            created_at, 
            status, 
            subtotal, 
            tax, 
            delivery_fee, 
            total, 
            user_id, 
            restaurant_table_id, 
            table_session_id, 
            order_type, 
            is_paid,
            items_count:order_items(count())
          `)
          .eq('restaurant_id', merchantProfile.id)
          .order('created_at', { ascending: false });
          
        if (orderError) throw orderError;
        
        // Process the orders with proper type handling
        const processedOrders: Order[] = (orderData || []).map(order => ({
          ...order,
          status: ensureOrderStatus(order.status),
          order_type: ensureOrderType(order.order_type || 'delivery'),
          items_count: Number(order.items_count) || 0
        }));
        
        setOrders(processedOrders);
        
      } catch (error) {
        console.error('Failed to load merchant data:', error);
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "There was a problem loading your merchant data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMerchantData();
  }, [user, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Become a Merchant</CardTitle>
            <CardDescription>
              Create a merchant profile to start selling your food items.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              As a merchant, you can add your food items, manage orders, and grow your business.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/merchant/profile" className="w-full">
              <Button className="w-full">Create Merchant Profile</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <MerchantNav />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="mr-2 h-4 w-4 text-eco-500" />
              <div className="text-2xl font-bold">{foodItems.length}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingBag className="mr-2 h-4 w-4 text-eco-500" />
              <div className="text-2xl font-bold">{orders.length}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-eco-500" />
              <div className="text-2xl font-bold">
                ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="products" className="my-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <div className="flex justify-between items-center my-4">
            <h2 className="text-xl font-bold">Your Products</h2>
            <Link to="/merchant/products/new">
              <Button>Add New Product</Button>
            </Link>
          </div>
          
          {foodItems.length === 0 ? (
            <Card className="my-4">
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground">
                  You haven't added any products yet.
                </p>
                <Link to="/merchant/products/new">
                  <Button variant="outline" className="mt-4">
                    Add Your First Product
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foodItems.map((item) => (
                <Link to={`/merchant/products/${item.id}`} key={item.id}>
                  <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                    {item.image_url && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={item.image_url} 
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{item.title}</h3>
                      <div className="flex justify-between mt-2">
                        <p className="text-sm text-muted-foreground">
                          ${item.discounted_price.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {item.quantity}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="orders">
          {/* Orders section would go here */}
          <div className="my-4">
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            {/* A table of orders would go here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MerchantDashboardPage;
