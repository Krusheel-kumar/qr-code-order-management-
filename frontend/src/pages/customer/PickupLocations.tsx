import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Clock, ChevronLeft, Phone } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { STORES } from '../../data/stores';

export default function PickupLocations() {
  const navigate = useNavigate();
  const { setOrderType, setStoreId } = useCartStore();

  const handleSelectStore = (storeId: string) => {
    setOrderType('PICKUP');
    setStoreId(storeId);
    navigate('/home');
  };

  const getDirectionsUrl = (address: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  return (
    <div className="min-h-[100dvh] bg-[#FFFBF2] flex flex-col font-sans relative">
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-4 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-700 active:scale-95 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Select Pickup Store</h1>
        <div className="w-10" /> {/* spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Available Stores</p>
        
        <div className="grid gap-4 pb-20">
          {STORES.map(store => (
            <div 
              key={store.id}
              className={`bg-white rounded-[1.5rem] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border ${!store.isOpen ? 'border-red-100/50 opacity-70' : 'border-gray-100/80'} relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-2">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => store.isOpen && handleSelectStore(store.id)}
                >
                  <h3 className="text-lg font-black text-gray-900 mb-1">{store.name}</h3>
                  <div className="flex items-start gap-1.5 text-gray-500 text-xs font-medium pr-4">
                    <MapPin size={14} className="shrink-0 mt-0.5 text-primary" />
                    <span>{store.address}</span>
                  </div>
                </div>
              </div>

              <div 
                className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 cursor-pointer mb-4"
                onClick={() => store.isOpen && handleSelectStore(store.id)}
              >
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className={`flex items-center gap-1.5 ${store.isOpen ? 'text-emerald-600' : 'text-red-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${store.isOpen ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    {store.isOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock size={12} />
                    Closes {store.closesAt}
                  </span>
                </div>
                
                <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                  {store.distance}
                </span>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`tel:${store.phone}`, '_self');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gray-50 text-gray-700 font-bold text-sm flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-100 active:scale-[0.98] transition-all"
                >
                  <Phone size={16} /> Call Store
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // @ts-ignore - mapUrl is optional
                    window.open(store.mapUrl || getDirectionsUrl(store.address), '_blank');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center gap-2 border border-blue-100 hover:bg-blue-100 active:scale-[0.98] transition-all shadow-sm"
                >
                  <Navigation size={16} fill="currentColor" /> Directions
                </button>
              </div>
              
              {!store.isOpen && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center cursor-not-allowed">
                  <span className="bg-red-500 text-white font-black px-4 py-2 rounded-xl text-sm shadow-lg tracking-widest uppercase rotate-[-5deg]">
                    Currently Closed
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
