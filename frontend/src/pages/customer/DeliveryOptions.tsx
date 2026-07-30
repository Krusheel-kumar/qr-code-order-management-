import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function DeliveryOptions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-[#FFFBF2] flex flex-col font-sans px-5 pb-10">
      {/* Header */}
      <div className="pt-6 pb-4 flex items-center justify-between relative z-20">
        <button onClick={() => navigate(-1)} className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-gray-900 shadow-[0_4px_15px_rgba(0,0,0,0.05)] active:scale-95 transition-transform">
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Premium Header */}
      <div className="mt-6 mb-10 flex flex-col items-start relative z-10">
        <h1 className="text-[3rem] font-black text-[#1A0B05] leading-tight tracking-tighter mb-2 font-heading">
          Home Delivery
        </h1>
        <p className="text-gray-500 font-medium text-lg leading-relaxed">
          Choose your preferred delivery partner.
        </p>
      </div>
      
      {/* Premium Content Cards */}
      <div className="flex-1 flex flex-col gap-4 relative z-20">
        <button 
          onClick={() => window.open('https://www.zomato.com/hyderabad/restaurants/pop-obob-bubble-tea-cafe', '_blank')}
          className="w-full bg-white backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-[0_15px_40px_rgba(226,55,68,0.06)] hover:shadow-[0_15px_40px_rgba(226,55,68,0.12)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-5 group relative overflow-hidden"
        >
          {/* Subtle gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="w-16 h-16 bg-[#E23744] rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 shrink-0 transform group-hover:rotate-6 transition-transform duration-500 relative z-10">
            <span className="text-white text-3xl font-black italic">Z</span>
          </div>
          
          <div className="flex flex-col items-start text-left flex-1 relative z-10">
            <span className="text-2xl font-black tracking-tight text-[#1A0B05] leading-none mb-1">Zomato</span>
            <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">Order Now</span>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center relative z-10 shrink-0 group-hover:bg-red-50 transition-colors">
            <span className="text-xl text-gray-300 group-hover:text-[#E23744] transform group-hover:translate-x-1 transition-all">&rarr;</span>
          </div>
        </button>
        
        <button 
          onClick={() => window.open('https://www.swiggy.com/city/hyderabad/pop-o-bob-bubble-tea-cafe', '_blank')}
          className="w-full bg-white backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-[0_15px_40px_rgba(252,128,25,0.06)] hover:shadow-[0_15px_40px_rgba(252,128,25,0.12)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-5 group relative overflow-hidden"
        >
          {/* Subtle gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="w-16 h-16 bg-[#FC8019] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0 transform group-hover:-rotate-6 transition-transform duration-500 relative z-10">
            <span className="text-white text-3xl font-black">S</span>
          </div>
          
          <div className="flex flex-col items-start text-left flex-1 relative z-10">
            <span className="text-2xl font-black tracking-tight text-[#1A0B05] leading-none mb-1">Swiggy</span>
            <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">Order Now</span>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center relative z-10 shrink-0 group-hover:bg-orange-50 transition-colors">
            <span className="text-xl text-gray-300 group-hover:text-[#FC8019] transform group-hover:translate-x-1 transition-all">&rarr;</span>
          </div>
        </button>
        
        <div className="relative flex items-center py-3">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">Or skip the fees</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button 
          onClick={() => navigate('/menu')}
          className="w-full bg-[#1A0B05] p-5 rounded-3xl shadow-[0_15px_40px_rgba(26,11,5,0.2)] hover:shadow-[0_15px_40px_rgba(26,11,5,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-5 group relative overflow-hidden"
        >
          {/* Golden glow wash */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFC461] rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20 shrink-0 transform group-hover:scale-110 transition-transform duration-500 relative z-10">
            <span className="text-black text-2xl font-black drop-shadow-sm">🛍️</span>
          </div>
          
          <div className="flex flex-col items-start text-left flex-1 relative z-10">
            <span className="text-2xl font-black tracking-tight text-white leading-none mb-1">Order Direct</span>
            <span className="text-[11px] font-bold text-[#FFC461] tracking-widest uppercase">Zero Platform Fees</span>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative z-10 shrink-0 group-hover:bg-[#D4AF37]/20 transition-colors">
            <span className="text-xl text-white/40 group-hover:text-[#D4AF37] transform group-hover:translate-x-1 transition-all">&rarr;</span>
          </div>
        </button>
      </div>
    </div>
  );
}
