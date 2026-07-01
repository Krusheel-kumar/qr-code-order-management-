import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronRight, Store, Home, Clock, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { STORES } from '../../data/stores';

interface GlassHeaderProps {
  onOpenProfile: () => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
}

export default function GlassHeader({ onOpenProfile, onOpenSearch, onOpenAuth }: GlassHeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { orderType, storeId } = useCartStore();
  const [activeTab, setActiveTab] = useState<'pickup' | 'delivery'>(orderType === 'PICKUP' ? 'pickup' : 'pickup');
  
  const currentStore = storeId ? STORES.find(s => s.id === storeId) : STORES[0]; // fallback for trial

  const handleTabChange = (tab: 'pickup' | 'delivery') => {
    if (tab === 'delivery') {
      navigate('/delivery-options');
      return;
    }
    setActiveTab(tab);
    useCartStore.getState().setOrderType('PICKUP');
    useCartStore.getState().setTableNumber('');
    
    if (tab === 'pickup' && !currentStore) {
      navigate('/pickup-locations');
    }
  };

  return (
    <div className="relative z-50 w-full mb-4 pt-2 px-4 font-poppins">
      
      {/* Clean White Card Design - Scaled Down */}
      <div className="rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-3 relative border border-gray-100">
        
        {/* Header Row */}
        <div className="flex justify-between items-center mb-4">
          {/* Logo Section */}
          <div className="flex items-center h-16 ml-[-4px]">
            <img src="/assets/horizontal_logo.png" alt="POP O'BOB® Logo" className="h-full w-auto object-contain drop-shadow-sm scale-[1.45] origin-left" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <button 
                onClick={onOpenProfile}
                className="w-8 h-8 rounded-full bg-[#FFC461] text-white flex items-center justify-center shadow-sm font-extrabold text-[13px] active:scale-95 transition-all"
              >
                {user.username.charAt(0).toUpperCase()}
              </button>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center shadow-sm active:scale-95 transition-all hover:bg-gray-50"
              >
                <User size={15} strokeWidth={2.5} />
              </button>
            )}
            <button 
              onClick={onOpenSearch}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 shadow-sm active:scale-95 transition-all hover:bg-gray-50"
            >
              <Search size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Fulfillment Options - Hide if Dine In */}
        {orderType !== 'DINE_IN' && (
          <div className="flex bg-white rounded-full border border-gray-100 mb-3 p-[3px] shadow-sm">
            <button 
              onClick={() => handleTabChange('pickup')}
              className={`flex-1 py-1.5 text-[12.5px] font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${activeTab === 'pickup' ? 'bg-[#FFC973] text-[#1A1A1A]' : 'bg-transparent text-[#4A5568] hover:text-[#1A1A1A]'}`}
            >
              <Store size={14} strokeWidth={2.5} className={activeTab === 'pickup' ? 'text-[#1A1A1A]' : 'text-[#718096]'} /> Store Pickup
            </button>
            <button 
              onClick={() => handleTabChange('delivery')}
              className={`flex-1 py-1.5 text-[12.5px] font-bold rounded-full transition-all flex items-center justify-center gap-1.5 ${activeTab === 'delivery' ? 'bg-[#FFC973] text-[#1A1A1A]' : 'bg-transparent text-[#4A5568] hover:text-[#1A1A1A]'}`}
            >
              <Home size={14} strokeWidth={2.5} className={activeTab === 'delivery' ? 'text-[#1A1A1A]' : 'text-[#718096]'} /> Home Delivery
            </button>
          </div>
        )}

        {/* Location Pill */}
        <button 
          onClick={() => {
            if (orderType !== 'DINE_IN') navigate('/pickup-locations');
          }}
          className={`w-full flex items-center justify-between bg-white rounded-[14px] p-2 border border-gray-200 shadow-sm transition-all group ${orderType === 'DINE_IN' ? 'cursor-default' : 'active:scale-95 hover:border-[#FFC461]/50'}`}
        >
          <div className="flex items-center gap-2 w-full overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFF0D4] to-[#FFE5C1] flex items-center justify-center shrink-0 shadow-inner">
              <MapPin size={15} className="text-[#FF9800]" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-start min-w-0 flex-1 pr-2">
              <h3 className="text-[12.5px] font-extrabold text-gray-900 mb-[1px] truncate w-full text-left leading-tight">
                {orderType === 'DINE_IN' ? 'Dine In' : (currentStore ? currentStore.name : 'Select a Store')}
              </h3>
              {orderType === 'DINE_IN' ? (
                <div className="flex items-center text-[10px] text-gray-500 font-medium">
                  {useCartStore.getState().tableNumber ? `Table ${useCartStore.getState().tableNumber}` : 'Scanning...'}
                  <span className="mx-1.5">•</span>
                  {currentStore?.name || 'Store'}
                </div>
              ) : currentStore && (
                <div className="flex items-center text-[9.5px] text-gray-500 font-medium w-full truncate">
                  <Clock size={10} className="mr-1 inline" /> Closes {currentStore.closesAt} 
                  <span className="mx-1.5">•</span> 
                  {currentStore.distance}
                  <span className="mx-1.5">•</span>
                  <span className={`flex items-center gap-1 font-bold ${currentStore.isOpen ? 'text-emerald-600' : 'text-red-500'}`}>
                    <span className={`w-1 h-1 rounded-full ${currentStore.isOpen ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    {currentStore.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="w-5 h-5 shrink-0 flex items-center justify-center text-[#FF9800] mr-0.5 group-hover:translate-x-0.5 transition-transform">
            <ChevronRight size={16} strokeWidth={2.5} />
          </div>
        </button>
      </div>
    </div>
  );
}
