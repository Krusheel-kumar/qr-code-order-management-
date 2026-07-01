import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Gift, ShoppingCart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';

export default function BottomNavigation() {
  const location = useLocation();
  const { items } = useCartStore();
  
  // Calculate total quantity of items in the cart
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/menu', icon: Grid, label: 'Menu' },
    { path: '/offers', icon: Gift, label: 'Offers' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart' },
    { path: '/profile', icon: User, label: 'Account' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 pb-[env(safe-area-inset-bottom)] z-[9999] shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
      <div className="flex justify-around items-center h-[75px] px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/home');
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className="flex flex-col items-center justify-center w-full h-full relative group"
            >
              <div className={`flex flex-col items-center justify-center transition-all duration-300 ${isActive ? '-translate-y-1' : 'group-hover:-translate-y-0.5'}`}>
                <div className={`relative mb-1.5 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                  {item.label === 'Cart' && cartItemCount > 0 && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border border-white">
                      {cartItemCount}
                    </div>
                  )}
                </div>
                <span className={`text-[11px] uppercase tracking-wide transition-colors ${isActive ? 'font-extrabold text-primary' : 'font-bold text-gray-400 group-hover:text-gray-600'}`}>
                  {item.label}
                </span>
              </div>
              
              {isActive && (
                <motion.div 
                  layoutId="bottom-nav-indicator"
                  className="absolute bottom-1 w-8 h-1 bg-primary rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
