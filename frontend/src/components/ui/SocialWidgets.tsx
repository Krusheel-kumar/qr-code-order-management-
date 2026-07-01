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
      // Clean up script when unmounting to prevent duplicates if navigating away and back
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

      <div className="w-full pt-16 pb-8 flex flex-col gap-12 relative z-10">
        
        {/* Modern Editorial Header */}
        <div className="px-6 flex flex-col items-center text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm mb-4">
            <span className="text-[10px] font-black tracking-[0.2em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#FF9800] to-[#FD1D1D]">Community</span>
          </div>
          <h3 className="font-black text-4xl text-[#1A0B05] mb-3 tracking-tighter leading-[1.1]">
            Join the <br/>
            <span className="relative inline-block">
              <span className="relative z-10 italic pr-2">POP O'BOB®</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-[#FFC461]/40 -z-10 rounded-full transform -rotate-1"></span>
            </span>
            Fam
          </h3>
          <p className="text-sm font-semibold text-gray-600 max-w-[250px]">
            Exclusive drops, secret menus, and daily boba aesthetics ✨
          </p>
        </div>
        
        {/* Floating Glass Bento Grid */}
        <div className="px-5">
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto">
            {/* Instagram Glass Box */}
            <motion.button 
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.open('https://www.instagram.com/POP O'BOB®official?igsh=MWQ0a2trdmwycDdjMg==', '_blank')}
              className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex flex-col p-5 group bg-white/50 backdrop-blur-3xl border-2 border-white/80"
            >
              {/* Instagram Gradient Blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] rounded-full blur-[30px] opacity-40 group-hover:opacity-70 transition-opacity duration-500 transform translate-x-10 -translate-y-10"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between items-start text-left w-full">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.08)] text-[#E1306C] group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
                
                <div className="w-full">
                  <span className="text-gray-500 text-[11px] font-black uppercase tracking-[0.25em] block mb-1">Follow Us</span>
                  <span className="text-[#1A0B05] font-black text-[22px] leading-none tracking-tighter block">@POP O'BOB®</span>
                </div>
              </div>
            </motion.button>

            {/* WhatsApp Glass Box */}
            <motion.button 
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.open('https://wa.me/1234567890?text=Hi%20POP O'BOB®!', '_blank')}
              className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex flex-col p-5 group bg-white/50 backdrop-blur-3xl border-2 border-white/80"
            >
              {/* WhatsApp Gradient Blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#128C7E] to-[#25D366] rounded-full blur-[30px] opacity-30 group-hover:opacity-60 transition-opacity duration-500 transform translate-x-10 -translate-y-10"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between items-start text-left w-full">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.08)] text-[#25D366] group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                
                <div className="w-full">
                  <span className="text-gray-500 text-[11px] font-black uppercase tracking-[0.25em] block mb-1">Chat</span>
                  <span className="text-[#1A0B05] font-black text-[22px] leading-none tracking-tighter block">WhatsApp</span>
                </div>
              </div>
            </motion.button>
            
            {/* Swiggy Glass Box */}
            <motion.button 
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.open('https://www.swiggy.com/city/hyderabad/pop-o-bob-bubble-tea-cafe', '_blank')}
              className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex flex-col p-5 group bg-white/50 backdrop-blur-3xl border-2 border-white/80"
            >
              {/* Swiggy Gradient Blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FC8019] to-[#FD5E0F] rounded-full blur-[30px] opacity-30 group-hover:opacity-70 transition-opacity duration-500 transform translate-x-10 -translate-y-10"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between items-start text-left w-full">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.08)] text-[#FC8019] font-black text-[26px] group-hover:scale-110 transition-transform duration-300">
                  S
                </div>
                
                <div className="w-full">
                  <span className="text-gray-500 text-[11px] font-black uppercase tracking-[0.25em] block mb-1">Order on</span>
                  <span className="text-[#1A0B05] font-black text-[22px] leading-none tracking-tighter block">Swiggy</span>
                </div>
              </div>
            </motion.button>
            
            {/* Zomato Glass Box */}
            <motion.button 
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.open('https://www.zomato.com/hyderabad/restaurants/pop-obob-bubble-tea-cafe', '_blank')}
              className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex flex-col p-5 group bg-white/50 backdrop-blur-3xl border-2 border-white/80"
            >
              {/* Zomato Gradient Blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E23744] to-[#CB202D] rounded-full blur-[30px] opacity-30 group-hover:opacity-70 transition-opacity duration-500 transform translate-x-10 -translate-y-10"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between items-start text-left w-full">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.08)] text-[#E23744] font-black text-[26px] italic group-hover:scale-110 transition-transform duration-300">
                  Z
                </div>
                
                <div className="w-full">
                  <span className="text-gray-500 text-[11px] font-black uppercase tracking-[0.25em] block mb-1">Order on</span>
                  <span className="text-[#1A0B05] font-black text-[22px] leading-none tracking-tighter block">Zomato</span>
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Reviews Section with modern glass header */}
        <div className="w-full mt-12 relative z-10">
          <div className="max-w-sm mx-auto px-5 w-full flex flex-col items-center">
            <div className="w-full bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] p-6 pt-8 pb-4">
               <h3 className="font-black text-2xl text-[#1A0B05] mb-6 text-center tracking-tight">
                  What Our <span className="text-[#FF9800]">Besties</span> Say
               </h3>
               {/* We rely on the Elfsight widget inside this beautiful glass container */}
               <div className="elfsight-app-a2d34f5a-63af-43a9-9dd6-98e16050776d w-full" data-elfsight-app-lazy></div>
            </div>
          </div>
        </div>

        {/* Ultra-Modern Footer */}
        <footer className="mt-8 pt-8 pb-16 w-full flex flex-col items-center justify-center relative z-10">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 border border-white shadow-[0_10px_30px_rgba(255,152,0,0.15)] overflow-hidden">
            <img src="/assets/logo 2.png" alt="POP O'BOB® Logo" className="w-full h-full object-cover scale-110" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
            {/* Fallback to favicon if logo 2 doesn't load nicely */}
            <img src="/favicon.svg" alt="POP O'BOB® Logo" className="w-10 h-10 object-contain hidden" />
          </div>
          
          <h2 className="text-2xl font-black tracking-tighter mb-8 text-[#1A0B05] uppercase">POP O'BOB®</h2>
          
          <div className="flex items-center gap-6 mb-12 bg-white/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white shadow-sm">
            <button onClick={() => navigate('/menu')} className="text-[10px] font-black text-gray-600 hover:text-[#FF9800] transition-colors uppercase tracking-[0.15em] active:scale-95">Menu</button>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <button onClick={() => navigate('/offers')} className="text-[10px] font-black text-gray-600 hover:text-[#FF9800] transition-colors uppercase tracking-[0.15em] active:scale-95">Offers</button>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <button onClick={() => window.open('https://wa.me/1234567890?text=I%20need%20support!', '_blank')} className="text-[10px] font-black text-gray-600 hover:text-[#FF9800] transition-colors uppercase tracking-[0.15em] active:scale-95">Support</button>
          </div>
          
          <div className="flex flex-col items-center gap-2 opacity-80">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">
              ALL RIGHTS RESERVED POP O'BOB®@2026
            </p>
            <p className="text-[11px] font-black tracking-[0.25em] uppercase text-gray-600 flex items-center gap-1.5 mt-1">
              DESIGNED WITH <span className="text-[#FF512F] drop-shadow-[0_0_8px_rgba(255,81,47,0.8)] animate-pulse text-[14px]">🧡</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
