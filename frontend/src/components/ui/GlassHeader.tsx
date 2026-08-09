import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronRight, ChevronDown, Store, Home, User, Bell, SlidersHorizontal, Menu, X, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useOrderStatus } from '../../hooks/useOrderStatus';
import { STORES } from '../../data/stores';
import SearchModal from './SearchModal';
import DeliveryModal from './DeliveryModal';

interface GlassHeaderProps {
  onOpenProfile: () => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
}

export default function GlassHeader({ onOpenProfile, onOpenSearch, onOpenAuth }: GlassHeaderProps) {
  const navigate = useNavigate();
  const { user, getLoyaltyTier } = useAuthStore();
  const { orderType, storeId } = useCartStore();
  const { activeOrders } = useOrderStatus();
  
  const [activeTab, setActiveTab] = useState<'pickup' | 'delivery'>(orderType === 'PICKUP' ? 'pickup' : 'pickup');
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const loyalty = getLoyaltyTier();
  
  const currentStore = storeId ? STORES.find(s => s.id === storeId) : null;

  const handleTabChange = (tab: 'pickup' | 'delivery') => {
    setActiveTab(tab);
    
    if (tab === 'delivery') {
      setIsDeliveryOpen(true);
      return;
    }
    
    useCartStore.getState().setOrderType('PICKUP');
    useCartStore.getState().setTableNumber('');
    
    if (tab === 'pickup' && !currentStore) {
      navigate('/pickup-locations');
    }
  };

  // Extract clean store name (remove "POP O'BOB® | " prefix if present) for the UI
  const storeNameDisplay = currentStore?.name?.split('|').pop()?.trim() || 'Select a Store';

  return (
    <div className="relative z-50 w-full pt-4 px-4 pb-2 font-poppins bg-[#FAFAFA]">
      
      {/* Top Row: Hamburger, Logo, Profile */}
      <div className="flex items-center justify-between mb-8 relative h-[48px] w-full">
        
        {/* Left: Hamburger Menu */}
        <div className="flex items-center h-full justify-start relative z-10">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-full text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shrink-0"
          >
            <Menu size={24} strokeWidth={2.5} />
          </button>
        </div>
          
        {/* Center: Logo */}
        <div className="flex items-center justify-center h-full -ml-1">
          <img 
            src="/assets/horizontal_logo.png" 
            alt="POP O'BOB® Logo" 
            className="h-[84px] w-auto max-w-none object-contain drop-shadow-sm" 
          />
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center h-full gap-2.5 justify-end relative z-10">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gray-100/80 active:scale-95 transition-all text-gray-700 hover:bg-gray-200/80"
          >
            <Bell size={18} strokeWidth={2} />
            {activeOrders.length > 0 && (
              <span className="absolute top-[8px] right-[8px] w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-white animate-pulse"></span>
            )}
          </button>
          
          {user ? (
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F9E5C5] p-[2px] animate-pulse"></div>
              <button 
                onClick={onOpenProfile}
                className="relative w-9 h-9 rounded-full bg-white text-[#1A0B05] flex items-center justify-center shadow-md font-black text-[13px] active:scale-95 transition-transform"
              >
                {user.username.charAt(0).toUpperCase()}
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100/80 border border-gray-200 active:scale-95 transition-all text-gray-700 hover:bg-gray-200 shadow-sm"
            >
              <User size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* Consolidated Location & Toggle Row */}
      <div className="flex items-center justify-between gap-2 mb-4">
        
        {/* Location Left */}
        <button 
          onClick={() => {
            if (orderType !== 'DINE_IN') navigate('/pickup-locations');
          }}
          className={`flex-1 flex items-center gap-2.5 transition-all group min-w-0 ${orderType === 'DINE_IN' ? 'cursor-default' : 'active:scale-[0.98]'}`}
        >
          <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0 text-[#FF9800]">
             <MapPin size={18} strokeWidth={2.5} />
          </div>
          
          <div className="flex-1 flex flex-col items-start min-w-0">
            <div className="flex items-center gap-1 w-full">
              <h3 className={`text-[14.5px] font-black truncate tracking-tight ${orderType !== 'DINE_IN' && !currentStore ? 'text-red-500' : 'text-gray-900'}`}>
                {orderType === 'DINE_IN' ? 'Dine In' : (currentStore?.name || 'No Store Selected')}
              </h3>
              {orderType !== 'DINE_IN' && <ChevronDown size={14} className="text-[#FF9800] shrink-0" strokeWidth={3} />}
            </div>
            
            <p className={`text-[11px] font-medium truncate w-full text-left ${orderType !== 'DINE_IN' && !currentStore ? 'text-red-400 font-bold' : 'text-gray-500'}`}>
              {orderType === 'DINE_IN' 
                 ? (useCartStore.getState().tableNumber ? `Table ${useCartStore.getState().tableNumber}` : 'Scanning...')
                 : (currentStore ? `Open till ${currentStore.closesAt}` : 'Tap here to pick a location')
              }
            </p>
          </div>
        </button>

        {/* Toggle Right */}
        {orderType !== 'DINE_IN' && (
          <div className="flex p-0.5 bg-gray-100/80 rounded-full shrink-0 relative w-[120px] shadow-inner">
            <div 
              className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-[var(--color-primary)] shadow-[0_2px_5px_rgba(255,213,79,0.4)] transition-transform duration-300 ease-out ${activeTab === 'pickup' ? 'translate-x-0' : 'translate-x-[calc(100%+4px)]'}`}
            />
            <button 
              onClick={() => handleTabChange('pickup')}
              className={`flex-1 py-1.5 text-[10.5px] font-extrabold rounded-full transition-colors flex items-center justify-center relative z-10 ${activeTab === 'pickup' ? 'text-[#1A0B05]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Pickup
            </button>
            <button 
              onClick={() => handleTabChange('delivery')}
              className={`flex-1 py-1.5 text-[10.5px] font-extrabold rounded-full transition-colors flex items-center justify-center relative z-10 ${activeTab === 'delivery' ? 'text-[#1A0B05]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Delivery
            </button>
          </div>
        )}
      </div>

      {/* Search Bar (Moved to bottom of header) */}
      <div className="flex items-center bg-white rounded-full border border-gray-200 px-4 py-3 shadow-sm">
        <Search size={20} className="text-gray-500 mr-2 shrink-0" strokeWidth={2} />
        <input 
          type="text" 
          readOnly
          onClick={onOpenSearch}
          placeholder="What are you craving today?" 
          className="flex-1 bg-transparent text-[13px] outline-none text-gray-700 cursor-pointer placeholder-gray-500 min-w-0"
        />
      </div>
      
      {/* Delivery Partners Modal */}
      <DeliveryModal 
        isOpen={isDeliveryOpen}
        onClose={() => {
          setIsDeliveryOpen(false);
          setActiveTab('pickup');
        }}
      />

      {/* Hamburger Drawer Overlay */}
      {createPortal(
        <AnimatePresence>
          {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99990]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[99991] shadow-2xl flex flex-col"
            >
              <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between">
                <img src="/assets/horizontal_logo.png" alt="POP O'BOB" className="h-10 object-contain" />
                <button onClick={() => setIsDrawerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600">
                  <X size={18} />
                </button>
              </div>

              {/* Loyalty Status Block */}
              <div className="p-6 pb-2">
                <div className={`w-full rounded-2xl bg-gradient-to-br ${loyalty.color} p-5 text-white shadow-lg relative overflow-hidden`}>
                  <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
                  <div className="flex flex-col mb-2">
                    <h4 className="font-black text-xl leading-tight">{user ? user.username : 'Guest User'}</h4>
                    {user && (
                      <span className="text-[11px] font-bold opacity-80 mt-0.5 tracking-wide">
                        {user.phoneNumber || user.email}
                      </span>
                    )}
                  </div>
                  
                  {!user ? (
                    <button 
                      onClick={() => { setIsDrawerOpen(false); onOpenAuth(); }}
                      className="font-bold text-sm opacity-100 underline decoration-white/50 underline-offset-4 hover:decoration-white transition-all active:scale-95"
                    >
                      Sign in to earn rewards
                    </button>
                  ) : (
                    <p className="font-bold text-sm opacity-90">{loyalty.name}</p>
                  )}
                  
                  {user && (
                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5 opacity-80">
                        <span>{user.loyaltyPoints} Pts</span>
                        <span>{loyalty.nextTier} Pts</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: `${loyalty.progress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 p-6 flex flex-col gap-4">
                <button onClick={() => { setIsDrawerOpen(false); navigate('/'); }} className="flex items-center gap-4 text-left font-black text-gray-800 text-lg hover:text-[#FF9800] transition-colors">
                  <Home size={22} className="text-gray-400" /> Home
                </button>
                <button onClick={() => { setIsDrawerOpen(false); navigate('/menu'); }} className="flex items-center gap-4 text-left font-black text-gray-800 text-lg hover:text-[#FF9800] transition-colors">
                  <Menu size={22} className="text-gray-400" /> Full Menu
                </button>
                <button onClick={() => { setIsDrawerOpen(false); navigate('/pickup-locations'); }} className="flex items-center gap-4 text-left font-black text-gray-800 text-lg hover:text-[#FF9800] transition-colors">
                  <Store size={22} className="text-gray-400" /> Locations
                </button>
              </div>

              {/* Footer Links */}
              <div className="p-6 bg-gray-50 flex flex-col gap-3">
                <button onClick={() => { setIsDrawerOpen(false); navigate('/privacy'); }} className="text-xs font-bold text-gray-500 text-left hover:text-gray-800">Privacy Policy</button>
                <button onClick={() => { setIsDrawerOpen(false); navigate('/terms'); }} className="text-xs font-bold text-gray-500 text-left hover:text-gray-800">Terms of Service</button>
                <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="text-xs font-bold text-[#FF9800] text-left mt-2">Contact Support</a>
              </div>
            </motion.div>
          </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Notifications Dropdown */}
      {createPortal(
        <AnimatePresence>
          {isNotificationsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationsOpen(false)}
              className="fixed inset-0 z-[99990]"
            />
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-16 right-4 w-[320px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-[99991] overflow-hidden"
            >
              <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <h4 className="font-black text-gray-900">Notifications</h4>
                {activeOrders.length > 0 && (
                  <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">{activeOrders.length} New</span>
                )}
              </div>
              
              <div className="max-h-[300px] overflow-y-auto">
                {activeOrders.length > 0 ? (
                  activeOrders.map(order => (
                    <div key={order.id} className="p-4 border-b border-gray-50 hover:bg-orange-50/50 transition-colors cursor-pointer" onClick={() => { setIsNotificationsOpen(false); navigate('/order-center'); }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF9800] flex items-center justify-center shrink-0">
                          {order.status === 'PREPARING' ? <Clock size={16} /> : <CheckCircle size={16} />}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900 leading-tight">Order #{order.id.slice(-4)}</p>
                          <p className="text-xs font-semibold text-gray-500 mt-0.5">{order.status === 'PREPARING' ? 'Your boba is currently being crafted!' : 'Your order is confirmed and in queue.'}</p>
                          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-2">{order.type}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                      <Bell size={20} className="text-gray-300" />
                    </div>
                    <p className="font-bold text-gray-900 text-sm">You're all caught up!</p>
                    <p className="text-xs font-semibold text-gray-500 mt-1">No new notifications right now.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
