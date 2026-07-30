import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingCart, User, Bot } from 'lucide-react';
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
    { path: '/ai/home', icon: Bot, label: 'AI', isCenter: true },
    { path: '/cart', icon: ShoppingCart, label: 'Cart' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9999]">
      {/* Safe Area Background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl border-t border-black/5 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] pointer-events-none" />
      
      <div className="relative flex justify-around items-center h-[72px] px-4 max-w-md mx-auto safe-pb">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/home');
          
          if (item.isCenter) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative -top-5 flex flex-col items-center justify-center group"
              >
                {/* Premium glowing ring effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37] to-[#F7C948] rounded-full blur-[8px] opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse" />
                
                <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-black via-[#1A0B05] to-black border-[1.5px] border-[#D4AF37]/50 shadow-[0_8px_25px_rgba(212,175,55,0.25)] hover:scale-105 transition-all duration-300 overflow-hidden">
                   <img 
                     src="/Brand Emblem.png" 
                     alt="POB AI" 
                     className="w-[70%] h-[70%] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] filter contrast-125"
                   />
                </div>
              </Link>
            );
          }

          return (
            <Link 
              key={item.path} 
              to={item.path}
              className="relative flex flex-col items-center justify-center w-[60px] h-full group"
            >
              <div className={`relative flex flex-col items-center justify-center z-10 transition-all duration-300 ${isActive ? '-translate-y-0.5' : ''}`}>
                <div className={`relative mb-1 transition-colors duration-300 ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-sm' : ''} />
                  {item.label === 'Cart' && cartItemCount > 0 && (
                    <div className="absolute -top-1 -right-2 w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm ring-2 ring-white">
                      {cartItemCount}
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-medium tracking-wide transition-all duration-300 ${isActive ? 'text-black opacity-100' : 'text-gray-400 opacity-80'}`}>
                  {item.label}
                </span>
              </div>
              
              {isActive && (
                <motion.div 
                  layoutId="bottom-nav-pill"
                  className="absolute inset-y-2 inset-x-0 bg-black/5 rounded-2xl z-0"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
