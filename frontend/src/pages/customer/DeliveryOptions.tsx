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

      {/* Gen Z Typography / Vibe Section */}
      <div className="mt-8 mb-12 flex flex-col items-start relative z-10">
        {/* Abstract glowing blobs for aesthetic */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#FFC461]/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 top-20 w-40 h-40 bg-[#FF9800]/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <span className="bg-white px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest text-[#FF9800] shadow-sm mb-5 border border-[#FFC461]/30">
          Delivery Mode On 🚀
        </span>
        
        <h1 className="text-[4rem] font-black text-[#1A0B05] leading-[0.95] tracking-tighter mb-5 font-heading">
          Secure <br/>
          the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9800] to-[#FFC461]">Boba.</span>
        </h1>
        
        <p className="text-gray-500 font-semibold text-lg max-w-[280px] leading-snug">
          Who's dropping off your daily dose of happiness? 🧋✨
        </p>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col gap-5 relative z-20">
        <button 
          onClick={() => window.open('https://www.zomato.com', '_blank')}
          className="w-full bg-gradient-to-r from-[#E23744] to-[#F05F6A] text-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(226,55,68,0.25)] hover:scale-[1.02] active:scale-[0.97] transition-all flex items-center justify-between group relative overflow-hidden"
        >
          {/* Abstract background shapes inside button */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-[100px] transition-transform duration-700 group-hover:scale-110"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-inner shrink-0">
              <img src="https://cdn.simpleicons.org/zomato/E23744" alt="Zomato" className="w-7 h-7" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-2xl font-black tracking-tight leading-none mb-1">Zomato</span>
              <span className="text-xs font-bold text-white/80 tracking-wide uppercase">Best Offers</span>
            </div>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md relative z-10 shrink-0">
            <span className="text-xl leading-none transform group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </button>
        
        <button 
          onClick={() => window.open('https://www.swiggy.com', '_blank')}
          className="w-full bg-gradient-to-r from-[#FC8019] to-[#FDA34D] text-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(252,128,25,0.25)] hover:scale-[1.02] active:scale-[0.97] transition-all flex items-center justify-between group relative overflow-hidden"
        >
          {/* Abstract background shapes inside button */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-[100px] transition-transform duration-700 group-hover:scale-110"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-inner shrink-0">
              <img src="https://cdn.simpleicons.org/swiggy/FC8019" alt="Swiggy" className="w-8 h-8" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-2xl font-black tracking-tight leading-none mb-1">Swiggy</span>
              <span className="text-xs font-bold text-white/80 tracking-wide uppercase">Fastest Delivery</span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md relative z-10 shrink-0">
            <span className="text-xl leading-none transform group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </button>
        
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">Or skip the fees</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button 
          onClick={() => navigate('/menu')}
          className="w-full bg-white text-gray-900 border-2 border-gray-900 p-6 rounded-[2rem] hover:bg-gray-50 active:scale-[0.97] transition-all flex items-center justify-between group relative overflow-hidden"
        >
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-2xl">🛍️</span>
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-2xl font-black tracking-tight leading-none mb-1">Order Direct</span>
              <span className="text-xs font-bold text-gray-500 tracking-wide uppercase">Zero Platform Fees</span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center relative z-10 shrink-0 group-hover:bg-gray-200 transition-colors">
            <span className="text-xl leading-none transform group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
        </button>
      </div>
    </div>
  );
}
