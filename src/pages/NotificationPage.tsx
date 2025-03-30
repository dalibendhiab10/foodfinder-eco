
import { useState, useEffect } from "react";
import { Bell, Check, ShoppingBag, CreditCard, MapPin } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: 'order' | 'promotion' | 'delivery' | 'payment' | 'system';
}

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Mock data for notifications
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Order Confirmed",
        message: "Your order #12345 has been confirmed and is being prepared.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false,
        type: 'order'
      },
      {
        id: "2",
        title: "Weekly Discount",
        message: "Enjoy 20% off on all eco-friendly restaurants this weekend!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: false,
        type: 'promotion'
      },
      {
        id: "3",
        title: "Delivery Update",
        message: "Your food is on the way! Estimated delivery time: 15 minutes.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        isRead: true,
        type: 'delivery'
      },
      {
        id: "4",
        title: "Payment Successful",
        message: "Your payment of $24.99 for order #12344 was successful.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        isRead: true,
        type: 'payment'
      },
      {
        id: "5",
        title: "New Restaurant Added",
        message: "GreenEats has joined our platform with sustainable food options!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        isRead: true,
        type: 'system'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
    toast({
      title: "Notification marked as read",
      duration: 1500,
    });
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

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hr ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
    }
  };

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
                className={`p-4 rounded-lg border ${notification.isRead ? 'bg-background' : 'bg-eco-50 border-eco-200'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-medium ${notification.isRead ? '' : 'font-semibold'}`}>{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                </div>
                {!notification.isRead && (
                  <div className="mt-3 flex justify-end">
                    <button 
                      onClick={() => markAsRead(notification.id)} 
                      className="flex items-center text-xs text-eco-600 gap-1 hover:text-eco-700"
                    >
                      <Check size={14} />
                      Mark as read
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="mx-auto text-muted-foreground mb-3" size={48} />
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
