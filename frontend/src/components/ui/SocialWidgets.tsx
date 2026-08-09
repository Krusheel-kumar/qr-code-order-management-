import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SocialWidgets() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Dynamically inject the Elfsight script on mount to ensure it detects the div in a React SPA
    const script = document.createElement('script');
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full relative z-10 overflow-hidden">
      
      {/* Dynamic Vibrant Mesh Background */}
      <div className="absolute inset-0 bg-[#FFFBF2] z-0">
        <div className="absolute top-[-10%] right-[-20%] w-96 h-96 bg-[#FF9800] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-96 h-96 bg-[#FFC461] rounded-full mix-blend-multiply filter blur-[100px] opacity-30"></div>
        <div className="absolute top-[40%] left-[20%] w-72 h-72 bg-[#FF7BA7] rounded-full mix-blend-multiply filter blur-[100px] opacity-15"></div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MOBILE EXPERIENCE (< lg) */}
      {/* ========================================================================= */}
      <div className="lg:hidden w-full pt-16 pb-8 flex flex-col gap-8 relative z-10">
        <div className="px-6 flex flex-col items-center text-center">
          <h3 className="font-black text-4xl text-[#1A0B05] mb-3 tracking-tighter leading-[1.1]">
            Explore More
          </h3>
          <p className="text-sm font-semibold text-gray-600 max-w-[250px]">
            Order delivery, follow our journey, or get instant support.
          </p>
        </div>
        
        {/* Bento Grid */}
        <div className="px-5 w-full max-w-sm mx-auto grid grid-cols-2 gap-4">
          
          {/* Swiggy Card */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://www.swiggy.com/city/hyderabad/pop-o-bob-bubble-tea-cafe', '_blank')}
            className="col-span-1 aspect-square rounded-[2rem] bg-gradient-to-br from-orange-50 to-white border border-orange-100 shadow-sm flex flex-col items-center justify-center gap-3 relative overflow-hidden group"
          >
            <div className="w-14 h-14 rounded-full bg-[#FC8019] text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">S</div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order on</span>
              <span className="text-lg font-black text-gray-800">Swiggy</span>
            </div>
          </motion.button>

          {/* Zomato Card */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://www.zomato.com/hyderabad/restaurants/pop-obob-bubble-tea-cafe', '_blank')}
            className="col-span-1 aspect-square rounded-[2rem] bg-gradient-to-br from-red-50 to-white border border-red-100 shadow-sm flex flex-col items-center justify-center gap-3 relative overflow-hidden group"
          >
            <div className="w-14 h-14 rounded-full bg-[#E23744] text-white flex items-center justify-center text-2xl font-black italic shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">Z</div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order on</span>
              <span className="text-lg font-black text-gray-800">Zomato</span>
            </div>
          </motion.button>

          {/* Instagram Wide Card */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open('https://www.instagram.com/popobobofficial?igsh=MWQ0a2trdmwycDdjMg==', '_blank')}
            className="col-span-2 rounded-[2rem] bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 shadow-sm p-4 flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-md group-hover:rotate-12 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Follow Us</span>
              <span className="text-lg font-black text-gray-900 leading-tight">@POPOBOB</span>
            </div>
          </motion.button>

          {/* WhatsApp Wide Card */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open('https://wa.me/1234567890?text=Hi%20POP%20O%20BOB!', '_blank')}
            className="col-span-2 rounded-[2rem] bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 shadow-sm p-4 flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Support</span>
              <span className="text-lg font-black text-gray-900 leading-tight">WhatsApp Chat</span>
            </div>
          </motion.button>
        </div>

        <div className="w-full mt-12 relative z-10">
          <div className="max-w-sm mx-auto px-5 w-full flex flex-col items-center">
            <div className="w-full bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] p-6 pt-8 pb-4">
               <div className="elfsight-app-a2d34f5a-63af-43a9-9dd6-98e16050776d w-full" data-elfsight-app-lazy></div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LUXURY DESKTOP EXPERIENCE (>= lg) */}
      {/* ========================================================================= */}
      <div className="hidden lg:block w-full pt-20 pb-16 relative z-10">
        <div className="max-w-[1440px] mx-auto px-8 xl:px-12">
          
          <div className="w-full bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-3xl border border-white/80 rounded-[3rem] p-12 xl:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.05)] relative overflow-hidden">
            
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FFC461]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#FF7BA7]/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-black/5 pb-8 gap-6">
              <div>
                <h3 className="text-4xl xl:text-5xl font-black text-[#1A0B05] tracking-tight leading-[1.05]">
                  Explore More
                </h3>
              </div>
              <p className="text-sm font-semibold text-gray-500 max-w-sm leading-relaxed">
                Get delivery, stay connected, and reach out to us.
              </p>
            </div>

            {/* Desktop Bento Grid */}
            <div className="grid grid-cols-4 gap-6">
              
              {/* Delivery Wide Block */}
              <div className="col-span-2 grid grid-cols-2 gap-6 bg-white/40 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] p-6 shadow-sm">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open('https://www.swiggy.com/city/hyderabad/pop-o-bob-bubble-tea-cafe', '_blank')}
                  className="rounded-[1.5rem] bg-gradient-to-br from-orange-50 to-white border border-orange-100 p-6 flex flex-col items-center justify-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-full bg-[#FC8019] text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">S</div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order on</span>
                    <span className="text-xl font-black text-gray-800">Swiggy</span>
                  </div>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open('https://www.zomato.com/hyderabad/restaurants/pop-obob-bubble-tea-cafe', '_blank')}
                  className="rounded-[1.5rem] bg-gradient-to-br from-red-50 to-white border border-red-100 p-6 flex flex-col items-center justify-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-full bg-[#E23744] text-white flex items-center justify-center text-3xl font-black italic shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">Z</div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order on</span>
                    <span className="text-xl font-black text-gray-800">Zomato</span>
                  </div>
                </motion.button>
              </div>

              {/* Instagram Tall Block */}
              <motion.button 
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => window.open('https://www.instagram.com/popobobofficial?igsh=MWQ0a2trdmwycDdjMg==', '_blank')}
                className="col-span-1 bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 group shadow-sm"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-md group-hover:rotate-12 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Follow Us</span>
                  <span className="text-xl font-black text-gray-900 mt-1">@POPOBOB</span>
                </div>
              </motion.button>

              {/* WhatsApp Tall Block */}
              <motion.button 
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => window.open('https://wa.me/1234567890?text=Hi%20POP%20O%20BOB!', '_blank')}
                className="col-span-1 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 group shadow-sm"
              >
                <div className="w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Support</span>
                  <span className="text-xl font-black text-gray-900 mt-1">Chat Now</span>
                </div>
              </motion.button>

            </div>

            <div className="mt-16 pt-12 border-t border-black/5">
              <div className="flex flex-col items-center">
                <div className="elfsight-app-a2d34f5a-63af-43a9-9dd6-98e16050776d w-full max-w-5xl" data-elfsight-app-lazy></div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
