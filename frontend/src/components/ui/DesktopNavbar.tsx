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

  const currentStore = storeId ? STORES.find(s => s.id === storeId) : STORES[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
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
      {/* LUXURY FLOATING PILL NAVBAR (Matches Mockup) */}
      {/* ========================================================================= */}
      <header className={`hidden lg:block fixed left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[1440px] z-[100] transition-all duration-500 ${isScrolled ? 'top-4' : 'top-6'}`}>
        <div className="relative bg-[#FCFAF8] backdrop-blur-3xl rounded-[3rem] px-4 xl:px-5 py-2.5 xl:py-3 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white flex items-center justify-between gap-4">
          
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
                  className="relative flex items-center gap-1.5 py-1 group"
                >
                  {link.icon && <link.icon size={16} className={link.isHighlight ? 'text-[#EAB308]' : 'text-gray-400 group-hover:text-[#1A0B05]'} />}
                  <span className={`text-sm font-semibold transition-colors ${
                    isActive 
                      ? 'text-[#1A0B05]' 
                      : link.isHighlight 
                        ? 'text-[#EAB308]' 
                        : 'text-gray-500 group-hover:text-[#1A0B05]'
                  }`}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#EAB308] rounded-full"
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
              className="w-10 h-10 xl:w-11 xl:h-11 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              title="Search menu (⌘K)"
            >
              <Search size={18} className="text-gray-700" />
            </button>

            {/* Location Handle */}
            {orderType !== 'DINE_IN' && (
              <div className="relative">
                <button 
                  onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
                  className={`flex items-center gap-3 bg-white border rounded-full px-4 py-2 shadow-sm transition-all group ${
                    isLocationMenuOpen ? 'border-[#EAB308]/40 shadow-md' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <MapPin size={16} className="text-gray-600 group-hover:text-[#1A0B05]" />
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[10px] font-medium text-gray-500 leading-tight">
                      {orderType === 'PICKUP' ? 'Pickup at' : 'Delivery to'}
                    </span>
                    <span className="text-[13px] font-bold text-[#1A0B05] leading-tight max-w-[90px] xl:max-w-[120px] truncate">
                      {currentStore?.name || 'Select Store'}
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
                              orderType === 'DELIVERY' ? 'bg-white text-[#1A0B05] shadow-sm border border-gray-100' : 'text-gray-500 hover:text-[#1A0B05]'
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
                className="w-10 h-10 xl:w-11 xl:h-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                title={user.username}
              >
                <span className="font-bold text-[#1A0B05] text-sm">{user.username.charAt(0).toUpperCase()}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-10 h-10 xl:w-11 xl:h-11 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                title="Sign In"
              >
                <User size={18} className="text-gray-700" />
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => navigate('/cart')}
              className="bg-[#1A0B05] hover:bg-black text-white rounded-full px-5 xl:px-6 py-2.5 xl:py-3 flex items-center gap-2 shadow-md transition-colors relative"
            >
              <ShoppingBag size={18} />
              <span className="font-bold text-sm">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-[22px] h-[22px] rounded-full bg-[#EAB308] text-white text-[10px] font-bold flex items-center justify-center border-[2.5px] border-[#FCFAF8]">
                  {cartItemCount}
                </span>
              )}
            </button>

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
