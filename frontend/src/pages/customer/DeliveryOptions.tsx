import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function DeliveryOptions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-[#FDFCF9] flex flex-col font-sans px-5 pb-6">
      {/* Header */}
      <div className="pt-6 pb-2 flex items-center justify-between relative z-20">
        <button onClick={() => navigate(-1)} className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-gray-900 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 active:scale-95 transition-transform relative z-10">
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Premium Header */}
      <div className="mt-4 mb-6 flex flex-col items-start relative z-10">
        <h1 className="text-[2.5rem] font-black text-[#1A0B05] leading-tight tracking-tighter mb-2 font-heading">
          Delivery Partners
        </h1>
        <p className="text-gray-500 font-medium text-[15px] leading-relaxed">
          Order your favorite bubble tea right to your doorstep through our trusted delivery partners.
        </p>
      </div>
      
      {/* Premium Content Cards */}
      <div className="flex flex-col gap-4 relative z-20 shrink-0">
        {/* Zomato Card */}
        <button 
          onClick={() => window.open('https://www.zomato.com/hyderabad/restaurants/pop-obob-bubble-tea-cafe', '_blank')}
          className="w-full bg-white p-4 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(226,55,68,0.12)] hover:border-[#E23744]/30 active:scale-[0.98] transition-all flex items-center gap-5 group relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="w-[60px] h-[60px] rounded-[18px] bg-[#E23744] flex items-center justify-center shrink-0 shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform duration-500 relative z-10">
            <span className="text-white text-[32px] font-black italic mt-1 pr-1">z</span>
          </div>
          
          <div className="flex flex-col items-start text-left flex-1 relative z-10 py-1">
            <span className="text-[20px] font-black tracking-tight text-gray-900 leading-none mb-2">Zomato</span>
            <span className="text-[10px] font-black text-[#E23744] tracking-widest uppercase bg-red-50/80 px-2.5 py-1 rounded-md border border-red-100/50">Order Here</span>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center relative z-10 shrink-0 group-hover:bg-[#E23744] transition-colors border border-gray-100 group-hover:border-[#E23744]">
            <span className="text-xl text-gray-400 group-hover:text-white transform group-hover:translate-x-0.5 transition-all">&rarr;</span>
          </div>
        </button>
        
        {/* Swiggy Card */}
        <button 
          onClick={() => window.open('https://www.swiggy.com/city/hyderabad/pop-o-bob-bubble-tea-cafe', '_blank')}
          className="w-full bg-white p-4 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(252,128,25,0.12)] hover:border-[#FC8019]/30 active:scale-[0.98] transition-all flex items-center gap-5 group relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="w-[60px] h-[60px] rounded-[18px] bg-[#FC8019] flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-500 relative z-10">
            <span className="text-white text-[32px] font-black mb-1">S</span>
          </div>
          
          <div className="flex flex-col items-start text-left flex-1 relative z-10 py-1">
            <span className="text-[20px] font-black tracking-tight text-gray-900 leading-none mb-2">Swiggy</span>
            <span className="text-[10px] font-black text-[#FC8019] tracking-widest uppercase bg-orange-50/80 px-2.5 py-1 rounded-md border border-orange-100/50">Order Here</span>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center relative z-10 shrink-0 group-hover:bg-[#FC8019] transition-colors border border-gray-100 group-hover:border-[#FC8019]">
            <span className="text-xl text-gray-400 group-hover:text-white transform group-hover:translate-x-0.5 transition-all">&rarr;</span>
          </div>
        </button>
      </div>
    </div>
  );
}
