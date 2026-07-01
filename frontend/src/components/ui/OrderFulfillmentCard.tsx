import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Clock, Info, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { STORES } from '../../data/stores';

export default function OrderFulfillmentCard() {
  const navigate = useNavigate();
  const { orderType, setOrderType, storeId } = useCartStore();
  const [activeTab, setActiveTab] = useState<'pickup' | 'delivery'>(orderType === 'PICKUP' ? 'pickup' : 'pickup'); 

  const currentStore = storeId ? STORES.find(s => s.id === storeId) : null;

  const handleTabChange = (tab: 'pickup' | 'delivery') => {
    if (tab === 'delivery') {
      navigate('/delivery-options');
      return;
    }
    setActiveTab(tab);
    setOrderType('PICKUP'); // ensure store explicitly updates
    useCartStore.getState().setTableNumber(''); // clear any ghost tables
    
    if (tab === 'pickup' && !currentStore) {
      navigate('/pickup-locations');
    }
  };

  return (
    <div className="mx-5 mb-4 relative z-10">
      <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden flex flex-col">
        
        {/* Toggle Header */}
        {orderType !== 'DINE_IN' && (
          <div className="flex bg-gray-50/80 p-1.5 border-b border-gray-100">
            <button 
              onClick={() => handleTabChange('pickup')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'pickup' ? 'bg-white text-gray-900 shadow-sm border border-gray-200/60' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Store Pickup
            </button>
            <button 
              onClick={() => handleTabChange('delivery')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'delivery' ? 'bg-white text-gray-900 shadow-sm border border-gray-200/60' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Home Delivery
            </button>
          </div>
        )}

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'pickup' && (
            <motion.div 
              key="pickup"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              {orderType === 'DINE_IN' ? (
                <div className="w-full text-left p-2 cursor-default">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 uppercase tracking-widest">
                      <MapPin size={12} className="text-emerald-500" />
                      Dine In
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-1 tracking-tight truncate pr-4">
                    Table {useCartStore.getState().tableNumber || '...'}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 font-medium">
                    {currentStore?.name || 'Loading store...'}
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/pickup-locations')}
                  className="w-full text-left group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                      <MapPin size={12} className="text-[#FFB300]" />
                      Pickup Store
                    </div>
                    <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  
                  <h3 className="text-lg font-black text-gray-900 mb-1 tracking-tight truncate pr-4">
                    {currentStore ? currentStore.name : 'Select a Store'}
                  </h3>
                
                {currentStore && (
                  <div className="flex items-center text-xs text-gray-500 font-medium">
                    <Clock size={12} className="mr-1" /> Closes {currentStore.closesAt} 
                    <span className="mx-2">•</span> 
                    {currentStore.distance}
                    <span className="mx-2">•</span>
                    <span className={`flex items-center gap-1 font-bold ${currentStore.isOpen ? 'text-emerald-600' : 'text-red-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${currentStore.isOpen ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {currentStore.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                )}
                </button>
              )}

              {currentStore && !currentStore.isOpen && (
                <div className="mt-3 bg-red-50 text-red-700 p-2.5 rounded-xl text-xs font-bold border border-red-100 flex items-start gap-2">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  This store is currently closed and not accepting orders. Please select another store.
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
