
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Package, User, QrCode } from "lucide-react";
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
        {isActive("/") && <span className="text-xs mt-1">Home</span>}
      </Link>
      
      <Link
        to="/search"
        className={`flex flex-col items-center justify-center p-2 ${
          isActive("/search") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Search className="w-5 h-5" />
        {isActive("/search") && <span className="text-xs mt-1">Search</span>}
      </Link>
      
      <Link
        to="/scan-qr"
        className={`flex flex-col items-center justify-center p-2 ${
          isActive("/scan-qr") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <QrCode className="w-5 h-5" />
        {isActive("/scan-qr") && <span className="text-xs mt-1">Scan QR</span>}
      </Link>
      
      <Link
        to="/orders"
        className={`flex flex-col items-center justify-center p-2 ${
          isActive("/orders") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Package className="w-5 h-5" />
        {isActive("/orders") && <span className="text-xs mt-1">Orders</span>}
      </Link>
      
      <Link
        to="/profile"
        className={`flex flex-col items-center justify-center p-2 ${
          isActive("/profile") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <User className="w-5 h-5" />
        {isActive("/profile") && <span className="text-xs mt-1">Profile</span>}
      </Link>
      

    </div>
  );
};

export default BottomNav;
