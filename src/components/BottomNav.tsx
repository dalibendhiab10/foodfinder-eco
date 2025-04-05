
import { Link, useLocation } from "react-router-dom";
import { Home, Search, User, Award } from "lucide-react"; // Removed Package, QrCode, added Award
import NotificationBell from "./NotificationBell";
import CartButton from "./CartButton";

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t py-2 px-4 flex justify-between items-center z-50">
      <Link
        to="/"
        className={`flex flex-col items-center justify-center p-2 ${
          isActive("/") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Home className="w-5 h-5" />
      </Link>
      
      <Link
        to="/search"
        className={`flex flex-col items-center justify-center p-2 ${
          isActive("/search") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Search className="w-5 h-5" />
      </Link>
      
      <Link
        to="/loyalty" // Added loyalty link
        className={`flex flex-col items-center justify-center p-2 ${
          isActive("/loyalty") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Award className="w-5 h-5" />
      </Link>
      
      <Link
        to="/profile"
        className={`flex flex-col items-center justify-center p-2 ${
          isActive("/profile") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <User className="w-5 h-5" />
      </Link>
      

    </div>
  );
};

export default BottomNav;
