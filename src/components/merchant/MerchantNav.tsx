
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Store, Package, Users, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const MerchantNav = () => {
  const links = [
    { href: '/merchant/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/merchant/profile', label: 'Profile', icon: Store },
    { href: '/merchant/products/new', label: 'Add Product', icon: Package },
    { href: '/merchant/collaborators', label: 'Collaborators', icon: Users },
  ];

  return (
    <div className="sticky top-[88px] z-20 bg-background pt-6 pb-2">
      <nav className="flex overflow-auto pb-2 mb-2 border-b">
        {links.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-2 mr-2 whitespace-nowrap rounded-md text-sm transition-colors",
                isActive 
                  ? "bg-eco-500 text-white" 
                  : "hover:bg-muted"
              )
            }
          >
            <link.icon className="h-4 w-4 mr-2" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MerchantNav;
