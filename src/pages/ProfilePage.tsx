
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, User, Settings, Heart, Star, CreditCard, LogOut, Edit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

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

  const menuItems = [
    { icon: User, label: 'Personal Information', path: '/profile/info' },
    { icon: CreditCard, label: 'Payment Methods', path: '/profile/payment' },
    { icon: Star, label: 'My Reviews', path: '/profile/reviews' },
    { icon: Heart, label: 'Favorites', path: '/profile/favorites' },
    { icon: Settings, label: 'Settings', path: '/profile/settings' },
  ];

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="p-4 sticky top-0 bg-background z-10 border-b">
        <div className="flex items-center">
          <Link to="/" className="mr-2">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
      </div>

      {/* User info */}
      <div className="p-6 flex items-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden mr-4">
          {user?.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
          </h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </div>

      <Separator />

      {/* Menu */}
      <div className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className="flex items-center p-3 rounded-md hover:bg-muted transition-colors"
            >
              <item.icon className="h-5 w-5 mr-3 text-muted-foreground" />
              <span>{item.label}</span>
            </Link>
          ))}
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center p-3 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
