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
      {/* Premium Header */}
      <div className="bg-[#1A0B05] px-6 pt-10 pb-6 flex flex-col justify-end sticky top-0 z-20 rounded-b-[2rem] shadow-xl shadow-[#1A0B05]/10">
        <div className="flex items-center gap-4 mb-2">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Find a store</p>
            <h1 className="text-2xl font-black text-white tracking-tight leading-none">Our Locations</h1>
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
                className={`bg-white rounded-[2rem] p-6 shadow-sm border transition-all duration-300 relative overflow-hidden group ${
                  !store.isOpen 
                    ? 'border-red-100/50 opacity-70' 
                    : isSelected 
                      ? 'border-[#D4AF37] shadow-[0_8px_30px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]' 
                      : 'border-gray-100 hover:border-[#D4AF37]/40 hover:shadow-md'
                }`}
              >
                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute top-5 right-5 bg-[#D4AF37]/10 text-[#D4AF37] p-1.5 rounded-full">
                    <CheckCircle2 size={20} className="fill-[#D4AF37] text-white" />
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div 
                    className="flex-1 cursor-pointer pr-10"
                    onClick={() => store.isOpen && handleSelectStore(store.id)}
                  >
                    <h3 className="text-xl font-black text-[#1A0B05] mb-1.5 group-hover:text-[#D4AF37] transition-colors">{store.name}</h3>
                    <div className="flex items-start gap-2 text-gray-500 text-sm font-medium">
                      <MapPin size={16} className="shrink-0 mt-0.5 text-[#D4AF37]" />
                      <span className="leading-snug">{store.address}</span>
                    </div>
                  </div>
                </div>

                <div 
                  className="flex items-center justify-between mb-6 cursor-pointer bg-gray-50/50 rounded-xl p-3"
                  onClick={() => store.isOpen && handleSelectStore(store.id)}
                >
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${store.isOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${store.isOpen ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {store.isOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Clock size={14} />
                      Closes {store.closesAt}
                    </span>
                  </div>
                  
                  <span className="text-xs font-black text-[#1A0B05] bg-[#D4AF37]/20 px-3 py-1.5 rounded-lg border border-[#D4AF37]/20">
                    {store.distance}
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`tel:${store.phone}`, '_self');
                    }}
                    className="flex-1 py-3.5 rounded-full bg-white text-[#1A0B05] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-[#1A0B05] hover:bg-[#1A0B05] hover:text-white active:scale-[0.98] transition-all"
                  >
                    <Phone size={14} /> Call Store
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // @ts-ignore - mapUrl is optional
                      window.open(store.mapUrl || getDirectionsUrl(store.address), '_blank');
                    }}
                    className="flex-1 py-3.5 rounded-full bg-[#1A0B05] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-[#1A0B05] hover:bg-[#D4AF37] hover:text-[#1A0B05] hover:border-[#D4AF37] active:scale-[0.98] transition-all shadow-md"
                  >
                    <Navigation size={14} fill="currentColor" /> Directions
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
