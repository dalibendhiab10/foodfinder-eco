
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';
import { User, Settings, Heart, Star, CreditCard, LogOut, Leaf, Loader2, Store } from 'lucide-react'; // Added Store icon
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { getUserLoyaltyProfile } from '@/services/loyaltyService';
import EcoImpactCard from '@/components/EcoImpactCard';
import { checkMerchantRole } from '@/services/merchantService'; // Import to check merchant role

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userProfile, setUserProfile] = useState<{ ecoPoints: number, ecoLevel: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMerchant, setIsMerchant] = useState(false); // Add state for merchant role

  // Fetch user loyalty profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const profile = await getUserLoyaltyProfile(user.id);
        setUserProfile(profile);
        
        // Check if user has merchant role
        const hasMerchantRole = await checkMerchantRole();
        setIsMerchant(hasMerchantRole);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

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
  ];

  return (
    // Use pb-20 for space above BottomNav. Use grid layout.
    <div className="container max-w-md mx-auto pb-20 bg-background min-h-screen grid grid-cols-1">
      {/* User Details Section - Centered content, no relative/absolute */}
      {user && (
        <div className="bg-eco-500 rounded-b-2xl p-6 mb-6 flex flex-col items-center space-y-4 text-white">
          {/* Avatar Placeholder */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 flex items-center justify-center text-white">
            <User size={40} />
          </div>
          {/* User Info - Centered */}
          <div className="flex-grow text-center">
            <h2 className="text-xl md:text-2xl font-semibold">{user.user_metadata?.full_name || 'User Name'}</h2>
            <p className="text-sm text-eco-100">{user.email}</p>
          </div>
          {/* Icon Buttons Container - Centered below text */}
          <div className="flex items-center justify-center space-x-2 pt-2">
            <Button
              variant="outline"
              size="icon"
              className="border-white text-eco-600 hover:bg-white  h-8 w-8"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Logout"
            >
              {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut size={16} />}
            </Button>
          </div>
        </div>
      )}

      {/* Loyalty/Eco Impact Section - Uses the new component */}
      <div className="px-4">
        <EcoImpactCard userProfile={userProfile} loading={loading} />

        {/* Restaurant Management Button - Only show if user has merchant role */}
        {isMerchant && (
          <Link to="/merchant/dashboard" className="w-full mb-6 block">
            <Button 
              className="w-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2" 
              size="lg"
            >
              <Store size={18} />
              Manage My Restaurant
            </Button>
          </Link>
        )}
        
        {/* If user is not a merchant, show a button to become one */}
        {!isMerchant && (
          <Link to="/merchant/profile" className="w-full mb-6 block">
            <Button 
              className="w-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2" 
              size="lg"
            >
              <Store size={18} />
              Become a Restaurant Owner
            </Button>
          </Link>
        )}

      {/* Menu Section - Use current logic but wrap in a Card for visual grouping */}
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
