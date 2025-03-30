
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface NotificationBellProps {
  unreadCount?: number;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ unreadCount = 0 }) => {
  const [count, setCount] = useState(unreadCount);
  
  // For demo purposes, randomly increase the notification count
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance of getting a new notification
        setCount(prevCount => prevCount + 1);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(timer);
  }, []);
  
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
