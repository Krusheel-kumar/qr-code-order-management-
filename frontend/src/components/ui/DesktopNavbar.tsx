import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Store, Home as HomeIcon, User, Sparkles, MapPin, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { STORES } from '../../data/stores';
import SearchModal from './SearchModal';
import AuthModal from './AuthModal';
import ProfileSheet from './ProfileSheet';
import CustomizerSheet from '../CustomizerSheet';
import type { MenuItem } from '../../data/menu';

export default function DesktopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { orderType, storeId, items, setOrderType, setTableNumber } = useCartStore();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  const currentStore = storeId ? STORES.find(s => s.id === storeId) : null;

  useEffect(() => {
    const handleScroll = () => {
      const isNowScrolled = window.scrollY > 15;
      setIsScrolled(prev => prev !== isNowScrolled ? isNowScrolled : prev);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global CMD+K or CTRL+K search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { path: '/home', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/offers', label: 'Offers' },
    { path: '/ai/home', label: 'AI Assistant', icon: Sparkles, isHighlight: true },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* LUXURY U-SHAPED NAVBAR */}
      {/* ========================================================================= */}
      <header className={`hidden lg:block fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] z-[100] transition-all duration-500`}>
        <div className={`relative backdrop-blur-2xl rounded-b-[2.5rem] px-6 xl:px-10 shadow-[0_12px_40px_rgba(0,0,0,0.05)] border-b border-white/60 flex items-center justify-between gap-4 transition-all duration-500 ${
          isScrolled ? 'bg-white/95 py-2.5 xl:py-3.5' : 'bg-white/80 py-4 xl:py-5'
        }`}>
          
          {/* ========================================================================= */}
          {/* LEFT ZONE: Logo */}
          {/* ========================================================================= */}
          <div className="flex items-center shrink-0">
            {/* Logo */}
            <Link to="/home" className="flex items-center shrink-0">
              <img 
                src="/assets/horizontal_logo.png" 
                alt="POP O'BOB® Logo" 
                className="h-14 xl:h-[4.25rem] w-auto max-w-[280px] object-contain drop-shadow-sm" 
              />
            </Link>

            {/* Vertical Divider */}
            <div className="hidden xl:block w-[1px] h-8 bg-gray-200 ml-6 xl:ml-8" />
          </div>

          {/* ========================================================================= */}
          {/* CENTER ZONE: Navigation Links (Absolutely Centered) */}
          {/* ========================================================================= */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 xl:gap-8 whitespace-nowrap">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (location.pathname === '/' && link.path === '/home');
              return (
                <Link 
                  key={link.path}
                  to={link.path}
                  className="relative flex items-center gap-1.5 py-2 group"
                >
                  {link.isHighlight ? (
                    <>
                      <link.icon size={16} className="text-[#EAB308]" />
                      <span className="text-[15px] font-bold bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent">
                        {link.label}
                      </span>
                    </>
                  ) : (
                    <>
                      {link.icon && <link.icon size={16} className="text-gray-400 group-hover:text-[#1A0B05] transition-colors" />}
                      <span className={`text-[15px] font-semibold transition-colors z-10 ${
                        isActive 
                          ? 'text-[#1A0B05]' 
                          : 'text-gray-500 group-hover:text-[#1A0B05]'
                      }`}>
                        {link.label}
                      </span>
                    </>
                  )}

                  {isActive && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#1A0B05] rounded-t-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ========================================================================= */}
          {/* RIGHT ZONE: Search, Location, Profile, Bag */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-3 xl:gap-4 shrink-0">
            
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 xl:w-11 xl:h-11 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-gray-50 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
              title="Search menu (⌘K)"
            >
              <Search size={18} className="text-gray-700" />
            </button>

            {/* Location Handle */}
            {orderType !== 'DINE_IN' && (
              <div className="relative">
                <button 
                  onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
                  className={`flex items-center gap-3 bg-white border rounded-full px-4 py-2 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group ${
                    isLocationMenuOpen ? 'border-[#EAB308]/40 shadow-md ring-2 ring-[#EAB308]/10' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                    <MapPin size={14} className="text-gray-600 group-hover:text-[#1A0B05]" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[10px] font-medium text-gray-500 leading-tight">
                      {orderType === 'PICKUP' ? 'Pickup at' : 'Delivery to'}
                    </span>
                    <span className={`text-[13px] font-bold leading-tight max-w-[90px] xl:max-w-[120px] truncate ${!currentStore ? 'text-red-500' : 'text-[#1A0B05]'}`}>
                      {currentStore?.name || 'No Store Selected'}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 ml-1 transition-transform ${isLocationMenuOpen ? 'rotate-180 text-[#1A0B05]' : ''}`} />
                </button>

                {/* Dropdown Menu Backdrop */}
                {isLocationMenuOpen && (
                  <div className="fixed inset-0 z-40" onClick={() => setIsLocationMenuOpen(false)} />
                )}

                {/* Dropdown Menu Content */}
                <AnimatePresence>
                  {isLocationMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-full left-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-gray-100 p-2 z-50 origin-top"
                    >
                      <div className="p-1 mb-1">
                        <span className="text-[10px] font-bold text-gray-400 block px-2 mb-2 uppercase tracking-widest">Fulfillment</span>
                        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                          <button
                            onClick={() => {
                              setOrderType('PICKUP');
                              setTableNumber('');
                              setIsLocationMenuOpen(false);
                            }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-all ${
                              orderType === 'PICKUP' ? 'bg-white text-[#1A0B05] shadow-sm border border-gray-100' : 'text-gray-500 hover:text-[#1A0B05]'
                            }`}
                          >
                            <Store size={14} /> Pickup
                          </button>
                          <button
                            onClick={() => {
                              navigate('/delivery-options');
                              setIsLocationMenuOpen(false);
                            }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-all ${
                              (orderType as string) === 'DELIVERY' ? 'bg-white text-[#1A0B05] shadow-sm border border-gray-100' : 'text-gray-500 hover:text-[#1A0B05]'
                            }`}
                          >
                            <HomeIcon size={14} /> Delivery
                          </button>
                        </div>
                      </div>
                      <div className="h-[1px] bg-gray-100 mx-2 mb-1" />
                      <button
                        onClick={() => {
                          navigate('/pickup-locations');
                          setIsLocationMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-[#1A0B05] transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                          <MapPin size={14} className="text-gray-500" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-bold leading-none mb-1">Change Store</span>
                          <span className="text-[10px] font-medium text-gray-500 leading-none">View all locations</span>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Profile Button */}
            {user ? (
              <button
                onClick={() => setIsProfileOpen(true)}
                className="w-10 h-10 xl:w-11 xl:h-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
                title={user.username}
              >
                <span className="font-bold text-[#1A0B05] text-sm">{user.username.charAt(0).toUpperCase()}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-10 h-10 xl:w-11 xl:h-11 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-gray-50 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
                title="Sign In"
              >
                <User size={18} className="text-gray-700" />
              </button>
            )}

            {/* Cart Button */}
            <div className="relative">
              <button
                onClick={() => navigate('/cart')}
                className="bg-[#1A0B05] hover:bg-black text-white rounded-full px-5 xl:px-6 py-2.5 xl:py-3 flex items-center gap-2 shadow-[0_4px_12px_rgba(26,11,5,0.2)] hover:shadow-[0_8px_20px_rgba(26,11,5,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <ShoppingBag size={18} className="relative z-10" />
                <span className="font-bold text-sm relative z-10">Cart</span>
              </button>
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-[22px] h-[22px] rounded-full bg-[#EAB308] text-white text-[10px] font-bold flex items-center justify-center border-[2.5px] border-white shadow-sm z-20">
                  {cartItemCount}
                </span>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Shared Modals for Desktop Header */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelectProduct={(product) => {
          setIsSearchOpen(false);
          setSelectedProduct(product);
        }} 
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

      <ProfileSheet 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      <CustomizerSheet 
        product={selectedProduct} 
        isOpen={selectedProduct !== null} 
        onClose={() => setSelectedProduct(null)} 
      />
    </>
  );
}
