import { useState, useEffect } from 'react';
import { Notification, NotificationType } from '@/types/notifications';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BellRing, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const typedData = data.map(item => ({
          ...item,
          type: item.type as NotificationType
        }));

        setNotifications(typedData);
      } catch (error: any) {
        console.error('Error fetching notifications:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load notifications',
          description: error.message || 'Please try again later',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, toast]);

  const handleMarkAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
      
      toast({
        title: "Notification marked as read",
        duration: 1500,
      });
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast({
        variant: 'destructive',
        title: 'Failed to update notification',
        description: 'Please try again later',
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="text-eco-500" />;
      case 'promotion': return <Bell className="text-amber-500" />;
      case 'delivery': return <MapPin className="text-blue-500" />;
      case 'payment': return <CreditCard className="text-purple-500" />;
      default: return <Bell className="text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hr ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-16">
        <div className="p-4 bg-background sticky top-0 z-50 border-b">
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-4 rounded-lg border">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="p-4 bg-background sticky top-0 z-50 border-b">
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>
      
      <div className="p-4">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg border ${notification.is_read ? 'bg-background' : 'bg-eco-50 border-eco-200'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-medium ${notification.is_read ? '' : 'font-semibold'}`}>{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{formatTimestamp(notification.created_at)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                </div>
                {!notification.is_read && (
                  <div className="mt-3 flex justify-end">
                    <button 
                      onClick={() => handleMarkAsRead(notification.id)} 
                      className="flex items-center text-xs text-eco-600 gap-1 hover:text-eco-700"
                    >
                      <CheckCircle size={14} />
                      Mark as read
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BellRing className="mx-auto text-muted-foreground mb-3" size={48} />
            <h3 className="text-lg font-medium">No notifications yet</h3>
            <p className="text-muted-foreground">We'll notify you when something important happens</p>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default NotificationPage;
