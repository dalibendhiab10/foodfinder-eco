import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';
import { User, Settings, Heart, Star, CreditCard, LogOut, Edit, Award, Gift, ChevronRight, Leaf } from 'lucide-react'; // Added Award, Gift, ChevronRight, Leaf
import { Link, useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator'; // Keep Separator
import { Card, CardContent } from '@/components/ui/card'; // Import Card for menu styling
import { Progress } from '@/components/ui/progress'; // Added Progress

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast({
        title: 'Logged out successfully',
      });
      navigate('/auth');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to log out. Please try again.',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Current menu items logic is preserved
  const menuItems = [
    { icon: User, label: 'Personal Information', path: '/profile/info' },
    { icon: CreditCard, label: 'Payment Methods', path: '/profile/payment' },
    { icon: Star, label: 'My Reviews', path: '/profile/reviews' },
    { icon: Heart, label: 'Favorites', path: '/profile/favorites' },
    // Settings is now an icon button in the header
  ];

  return (
    // Use pb-20 like the old version to ensure space above BottomNav
    <div className="container max-w-md mx-auto pb-20 bg-background min-h-screen"> 
      {/* Header section styled like the first version */}
      <div className="bg-eco-500 text-white pt-12 pb-6 px-4 rounded-b-3xl mb-6"> 
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="flex gap-2">
            {/* Settings Button */}
            <Link to="/profile/settings">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-white hover:bg-white/20"
              >
                <Settings size={20} />
              </Button>
            </Link>
            {/* Logout Button */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-white/20"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut size={20} />
            </Button>
          </div>
        </div>

        {/* User info section styled like the first version, using current logic */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center overflow-hidden">
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <User size={32} className="text-white" /> // Use white icon like old version
            )}
          </div>
          <div>
            <h2 className="font-bold text-lg">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </h2>
            <p className="text-white/70">{user?.email}</p>
            {/* You can re-add Eco Level here if data is available */}
            {/* <div className="flex items-center mt-1">
              <Leaf size={16} className="mr-1" />
              <span className="text-sm">Eco Level Placeholder</span>
            </div> */}
          </div>
        </div>
      </div>

      {/* Loyalty/Eco Impact Section - Added from commit a52cc0e */}
      <div className="px-4 -mt-4"> {/* Use -mt-4 to overlap with header like original */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Eco Impact</h3>
              <Award size={20} className="text-eco-500" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-eco-50 rounded-lg">
                {/* Placeholder Data */}
                <p className="text-3xl font-bold text-eco-600">0</p>
                <p className="text-sm text-muted-foreground">kg food saved</p>
              </div>
              <div className="text-center p-3 bg-eco-50 rounded-lg">
                {/* Placeholder Data */}
                <p className="text-3xl font-bold text-eco-600">0</p>
                <p className="text-sm text-muted-foreground">kg CO₂ reduced</p>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Eco Points</span>
                 {/* Placeholder Data */}
                <span className="font-medium">0</span>
              </div>
               {/* Placeholder Data */}
              <Progress value={0} className="h-2 bg-eco-100" />
            </div>

            <p className="text-xs text-muted-foreground mb-3">
              {/* Placeholder Text */}
              Earn points to reach the next level!
            </p>

            <Link to="/loyalty">
              <Button className="w-full flex justify-between bg-eco-500 hover:bg-eco-600">
                <span className="flex items-center gap-2">
                  <Gift size={16} />
                  Loyalty Program & Rewards
                </span>
                <ChevronRight size={16} />
              </Button>
            </Link>
          </CardContent>
        </Card>

      {/* Menu Section - Use current logic but wrap in a Card for visual grouping */}
      {/* Removed redundant px-4 wrapper, using the one above */}
        <Card className="shadow-lg">
          <CardContent className="p-2"> {/* Reduced padding for list items */}
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  // Style links similar to current, but within the card
                  className="flex items-center p-3 rounded-md hover:bg-muted transition-colors" 
                >
                  <item.icon className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>{item.label}</span>
                </Link>
              ))}
              {/* Separator can be added if needed between items or sections */}
              {/* <Separator /> */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BottomNav remains the same */}
      <BottomNav />
    </div>
  );
};

export default ProfilePage;

