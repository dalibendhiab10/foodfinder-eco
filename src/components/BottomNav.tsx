
import { Home, MapPin, ShoppingBag, User, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: MapPin, label: "Map", path: "/map" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: ShoppingBag, label: "Orders", path: "/orders" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-50">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = path === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 flex-1 ${
                isActive ? "text-eco-500" : "text-muted-foreground"
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
