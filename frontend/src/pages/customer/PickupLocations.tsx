import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Clock, ChevronLeft, Phone, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { STORES } from '../../data/stores';

export default function PickupLocations() {
  const navigate = useNavigate();
  const { setOrderType, setStoreId, storeId: currentStoreId } = useCartStore();

  const handleSelectStore = (storeId: string) => {
    setOrderType('PICKUP');
    setStoreId(storeId);
    navigate('/home');
  };

  const getDirectionsUrl = (address: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  return (
    <div className="min-h-[100dvh] bg-[#FDFCF9] flex flex-col font-sans relative">
      {/* Premium Light Header */}
      <div className="bg-white/95 backdrop-blur-xl px-6 pt-12 pb-5 flex flex-col sticky top-0 z-20 border-b border-gray-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-gray-50 active:scale-95 transition-all text-[#1A0B05] shrink-0"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={13} className="text-[#D4AF37]" strokeWidth={2.5} />
              <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] leading-none mt-0.5">Find a store</p>
            </div>
            <h1 className="text-[24px] font-black text-[#1A0B05] tracking-tight leading-none">Our Locations</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-8 xl:p-12 overflow-y-auto max-w-[1440px] mx-auto w-full">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-1">Available Stores</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 xl:gap-8 pb-20">
          {STORES.map(store => {
            const isSelected = currentStoreId === store.id;
            return (
              <div 
                key={store.id}
                className={`bg-white rounded-[1.5rem] shadow-sm border transition-all duration-300 relative overflow-hidden flex flex-col group p-4 ${
                  !store.isOpen 
                    ? 'border-red-100/50 opacity-70' 
                    : isSelected 
                      ? 'border-[#D4AF37] shadow-[0_8px_30px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]' 
                      : 'border-gray-100 hover:border-[#D4AF37]/40 hover:shadow-md'
                }`}
              >
                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-[#D4AF37]/90 backdrop-blur-sm text-white p-1 rounded-full z-10 shadow-sm">
                    <CheckCircle2 size={16} className="fill-[#D4AF37] text-white" />
                  </div>
                )}

                {/* Top Row: Thumbnail & Info */}
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div 
                    className="w-24 h-24 rounded-[1rem] bg-gray-100 relative overflow-hidden shrink-0 cursor-pointer"
                    onClick={() => store.isOpen && handleSelectStore(store.id)}
                  >
                    {/* @ts-ignore */}
                    {store.image && (
                      <img 
                        // @ts-ignore
                        src={store.image} 
                        alt={store.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div 
                    className="flex-1 flex flex-col pt-0.5 cursor-pointer"
                    onClick={() => store.isOpen && handleSelectStore(store.id)}
                  >
                    <h3 className="text-[15px] font-black text-[#1A0B05] mb-1 leading-tight pr-6 group-hover:text-[#D4AF37] transition-colors line-clamp-2">{store.name}</h3>
                    <div className="flex items-start gap-1 text-gray-500 text-[11px] font-medium mb-2 pr-1">
                      <MapPin size={12} className="shrink-0 mt-0.5 text-[#D4AF37]" strokeWidth={2.5} />
                      <span className="leading-snug line-clamp-2">{store.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-auto">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${store.isOpen ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {store.isOpen ? 'OPEN' : 'CLOSED'}
                      </span>
                      <div className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                        <Clock size={10} className="text-gray-400" />
                        {/* @ts-ignore */}
                        {store.opensAt} - {store.closesAt}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 relative z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (store.isOpen) handleSelectStore(store.id);
                    }}
                    className={`flex-[2] rounded-xl py-2.5 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                      isSelected 
                        ? 'bg-[#1A0B05] text-[#D4AF37] shadow-md' 
                        : 'bg-[#D4AF37] text-[#1A0B05] hover:bg-[#C5A028]'
                    }`}
                  >
                    <CheckCircle2 size={16} className={isSelected ? 'fill-[#D4AF37] text-[#1A0B05]' : ''} />
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      {isSelected ? 'Selected' : 'Select'}
                    </span>
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`tel:${store.phone}`, '_self');
                    }}
                    className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl py-2.5 flex items-center justify-center gap-1.5 hover:bg-gray-100 transition-colors active:scale-[0.98]"
                  >
                    <Phone size={14} />
                    <span className="text-[10px] font-black uppercase hidden sm:block">Call</span>
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // @ts-ignore
                      window.open(store.mapUrl || getDirectionsUrl(store.address), '_blank');
                    }}
                    className="flex-1 bg-gray-100 text-[#1A0B05] rounded-xl py-2.5 flex items-center justify-center gap-1.5 hover:bg-gray-200 transition-colors active:scale-[0.98]"
                  >
                    <Navigation size={14} />
                    <span className="text-[10px] font-black uppercase hidden sm:block">Map</span>
                  </button>
                </div>
                
                {!store.isOpen && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center cursor-not-allowed z-10">
                    <span className="bg-[#1A0B05] text-white font-black px-6 py-3 rounded-full text-sm shadow-xl tracking-widest uppercase rotate-[-5deg] border border-white/20">
                      Currently Closed
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
