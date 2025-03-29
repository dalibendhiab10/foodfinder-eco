
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, CreditCard, Edit, LogOut, Settings, 
  Leaf, User, MapPin, Package 
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { userMockData } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage = () => {
  const user = userMockData;
  const { toast } = useToast();
  
  const handleLogout = () => {
    // In a real app, this would call logout API
    localStorage.removeItem('isAuthenticated');
    
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account",
    });
    
    // Redirect to login page
    window.location.href = '/auth';
  };
  
  return (
    <div className="container max-w-md mx-auto pb-20">
      <div className="bg-eco-500 text-white pt-12 pb-6 px-4 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-white hover:bg-white/20"
              onClick={() => toast({
                title: "Settings",
                description: "Settings page would open here",
              })}
            >
              <Settings size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-white hover:bg-white/20"
              onClick={handleLogout}
            >
              <LogOut size={20} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{user.name}</h2>
            <p className="text-white/70">{user.email}</p>
            <div className="flex items-center mt-1">
              <Leaf size={16} className="mr-1" />
              <span className="text-sm">{user.ecoLevel}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 -mt-4">
        <Card className="shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Eco Impact</h3>
              <Award size={20} className="text-eco-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-eco-50 rounded-lg">
                <p className="text-3xl font-bold text-eco-600">{user.foodSaved}</p>
                <p className="text-sm text-muted-foreground">kg food saved</p>
              </div>
              <div className="text-center p-3 bg-eco-50 rounded-lg">
                <p className="text-3xl font-bold text-eco-600">{user.co2Reduced}</p>
                <p className="text-sm text-muted-foreground">kg CO₂ reduced</p>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Eco Points</span>
                <span className="font-medium">{user.ecoPoints}</span>
              </div>
              <Progress value={65} className="h-2 bg-eco-100" />
            </div>
            
            <p className="text-xs text-muted-foreground">
              235 more points until your next level: Green Guardian
            </p>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="info" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">Personal Information</h3>
                  <Button variant="ghost" size="icon">
                    <Edit size={16} />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p>{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p>{user.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">Address</h3>
                  <Button variant="ghost" size="icon">
                    <Edit size={16} />
                  </Button>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-muted-foreground mt-1" />
                  <p>{user.address}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">Payment Methods</h3>
                  <Button variant="outline" size="sm">+ Add New</Button>
                </div>
                
                <div className="space-y-3">
                  {user.savedPaymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard size={20} className="text-muted-foreground" />
                        <div>
                          {method.type === 'creditCard' ? (
                            <>
                              <p className="font-medium">{method.brand} •••• {method.last4}</p>
                              <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                            </>
                          ) : (
                            <>
                              <p className="font-medium">PayPal</p>
                              <p className="text-sm text-muted-foreground">{method.email}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">Eco Wallet</h3>
                  <Button className="bg-eco-500 hover:bg-eco-600">Top up</Button>
                </div>
                
                <div className="bg-gradient-to-r from-eco-600 to-eco-400 text-white p-4 rounded-lg mb-3">
                  <p className="text-sm mb-1">Current Balance</p>
                  <p className="text-3xl font-bold">$24.50</p>
                </div>
                
                <Link to="/transaction-history">
                  <Button variant="outline" className="w-full">View Transaction History</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="badges" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold mb-4">Your Eco Badges</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  {user.badges.map((badge) => (
                    <div key={badge.id} className="text-center">
                      <div className="w-16 h-16 flex items-center justify-center mx-auto bg-eco-50 rounded-full mb-2 text-2xl">
                        {badge.icon}
                      </div>
                      <p className="text-sm font-medium">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  ))}
                  
                  {/* Locked badge example */}
                  <div className="text-center opacity-50">
                    <div className="w-16 h-16 flex items-center justify-center mx-auto bg-gray-100 rounded-full mb-2 text-2xl">
                      🌍
                    </div>
                    <p className="text-sm font-medium">Earth Hero</p>
                    <p className="text-xs text-muted-foreground">Save 100kg of food</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
