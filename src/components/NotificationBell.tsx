
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface NotificationBellProps {
  unreadCount?: number;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ unreadCount = 0 }) => {
  const [count, setCount] = useState(unreadCount);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }
    
    // Fetch unread notification count
    const fetchUnreadCount = async () => {
      try {
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false);
          
        if (error) throw error;
        
        setCount(count || 0);
      } catch (err) {
        console.error('Error fetching notification count:', err);
      }
    };
    
    fetchUnreadCount();
    
    // Subscribe to notification changes
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          fetchUnreadCount();
        }
      )
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  return (
    <Link to="/notifications" className="relative p-2">
      <Bell className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute top-1 right-1 bg-eco-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
