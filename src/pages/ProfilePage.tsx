
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';
import { User, Settings, Heart, Star, CreditCard, LogOut, Award, Gift, ChevronRight, Leaf, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getUserLoyaltyProfile } from '@/services/loyaltyService';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userProfile, setUserProfile] = useState<{ ecoPoints: number, ecoLevel: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user loyalty profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const profile = await getUserLoyaltyProfile(user.id);
        setUserProfile(profile);
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
    // Settings is now an icon button in the header
  ];

  return (
    // Use pb-20 like the old version to ensure space above BottomNav
    <div className="container max-w-md mx-auto pt-20 pb-20 bg-background min-h-screen"> {/* Added pt-20 */}
      {/* Header section styled like the first version */}
      {/* Removed custom header section */}

      {/* Loyalty/Eco Impact Section - Added from commit a52cc0e */}
      <div className="px-4 -mt-4"> {/* Use -mt-4 to overlap with header like original */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Eco Impact</h3>
              <Award size={20} className="text-eco-500" />
            </div>

            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-eco-500" />
              </div>
            ) : (
              <>
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
                    <span className="font-medium">{userProfile?.ecoPoints || 0}</span>
                  </div>
                  <Progress value={userProfile?.ecoPoints ? Math.min(userProfile.ecoPoints / 100, 100) : 0} className="h-2 bg-eco-100" />
                </div>

                <p className="text-xs text-muted-foreground mb-3">
                  Earn points to reach the next level!
                </p>
              </>
            )}

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
