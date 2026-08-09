import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingCart, User, Bot, FileText } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';
import { useState } from 'react';

export default function BottomNavigation() {
  const location = useLocation();
  const { items } = useCartStore();
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous !== undefined && latest > previous && latest > 50) {
      // scrolling down
      setIsVisible(prev => prev ? false : prev);
    } else if (previous !== undefined && latest < previous) {
      // scrolling up
      setIsVisible(prev => !prev ? true : prev);
    }
  });
  
  // Calculate total quantity of items in the cart
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/menu', icon: Grid, label: 'Menu' },
    { path: '/ai/home', icon: Bot, label: 'AI', isCenter: true },
    { path: '/order-center', icon: FileText, label: 'Orders' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart' },
  ];
  const hideNavRoutes = ['/cart', '/processing', '/checkout'];
  if (hideNavRoutes.some(route => location.pathname.startsWith(route))) {
    return null;
  }

  return (
    <motion.nav 
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed bottom-0 left-0 right-0 z-[9999]"
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[24px] border-t border-white/40 shadow-[var(--shadow-soft-modal)]" />
      
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
                
                <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-black via-[#1A0B05] to-black border-[1.5px] border-[#D4AF37]/50 shadow-[0_8px_25px_rgba(212,175,55,0.25)] hover:scale-105 transition-all duration-300 overflow-hidden z-10">
                   <img 
                     src="/Brand Emblem.png" 
                     alt="POB AI" 
                     className="w-[70%] h-[70%] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] filter contrast-125"
                   />
                </div>
                <span className="absolute -bottom-5 text-[10px] font-black tracking-widest uppercase text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.9)] animate-pulse">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link 
              key={item.path} 
              to={item.path}
              className="relative flex flex-col items-center justify-center w-[64px] h-full group"
            >
              <div className={`relative flex flex-col items-center justify-center z-10 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isActive ? '-translate-y-1 scale-110' : 'hover:-translate-y-0.5'}`}>
                <div className={`relative mb-1 transition-colors duration-300 ${isActive ? 'text-[#FF9800]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-sm' : ''} />
                  {item.label === 'Cart' && cartItemCount > 0 && (
                    <div className="absolute -top-1 -right-2 w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm ring-2 ring-white">
                      {cartItemCount}
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-bold tracking-wide transition-all duration-300 ${isActive ? 'text-[#FF9800]' : 'text-gray-400 opacity-80'}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
