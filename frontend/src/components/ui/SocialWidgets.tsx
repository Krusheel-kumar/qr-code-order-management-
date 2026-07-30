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
      <div className="lg:hidden w-full pt-16 pb-8 flex flex-col gap-12 relative z-10">
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
        
        <div className="px-5 w-full max-w-sm mx-auto flex flex-col gap-4">
          
          {/* Instagram - Full Width Hero Card */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open('https://www.instagram.com/popobobofficial?igsh=MWQ0a2trdmwycDdjMg==', '_blank')}
            className="relative w-full rounded-3xl overflow-hidden shadow-lg p-1 group border border-white/50 bg-white/40 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-white/70 backdrop-blur-md rounded-[1.3rem] p-4 flex items-center gap-4 border border-white/60 shadow-inner">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-md transform group-hover:rotate-12 transition-all duration-500 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Follow our journey</span>
                <span className="text-xl font-black text-gray-900 tracking-tight leading-none mt-1">@POP O'BOB®</span>
              </div>
              <div className="ml-auto w-8 h-8 rounded-full bg-white/80 flex items-center justify-center group-hover:translate-x-1 transition-transform flex-shrink-0 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </div>
          </motion.button>

          {/* WhatsApp - Full Width Secondary Card */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open('https://wa.me/1234567890?text=Hi%20POP%20O%20BOB!', '_blank')}
            className="relative w-full rounded-3xl overflow-hidden shadow-lg p-1 group border border-white/50 bg-white/40 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#25D366] to-[#128C7E] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-white/70 backdrop-blur-md rounded-[1.3rem] p-4 flex items-center gap-4 border border-white/60 shadow-inner">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-all duration-500 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Quick Support</span>
                <span className="text-xl font-black text-gray-900 tracking-tight leading-none mt-1">WhatsApp Chat</span>
              </div>
              <div className="ml-auto w-8 h-8 rounded-full bg-white/80 flex items-center justify-center group-hover:translate-x-1 transition-transform flex-shrink-0 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </div>
          </motion.button>

          {/* Delivery Grid */}
          <div className="grid grid-cols-2 gap-4 mt-1">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('https://www.swiggy.com/city/hyderabad/pop-o-bob-bubble-tea-cafe', '_blank')}
              className="relative aspect-square rounded-[2rem] flex flex-col items-center justify-center group bg-white shadow-xl shadow-orange-500/10 border border-orange-100 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="w-16 h-16 rounded-full bg-[#FC8019] text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-orange-500/30 transform group-hover:-translate-y-2 transition-transform duration-300 mb-2 relative z-10">
                S
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest relative z-10">Order on</span>
              <span className="text-lg font-black text-gray-800 relative z-10">Swiggy</span>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('https://www.zomato.com/hyderabad/restaurants/pop-obob-bubble-tea-cafe', '_blank')}
              className="relative aspect-square rounded-[2rem] flex flex-col items-center justify-center group bg-white shadow-xl shadow-red-500/10 border border-red-100 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="w-16 h-16 rounded-full bg-[#E23744] text-white flex items-center justify-center text-3xl font-black italic shadow-lg shadow-red-500/30 transform group-hover:-translate-y-2 transition-transform duration-300 mb-2 relative z-10">
                Z
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest relative z-10">Order on</span>
              <span className="text-lg font-black text-gray-800 relative z-10">Zomato</span>
            </motion.button>
          </div>
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
          
          {/* One Premium Glass Container for Community & Delivery Partners */}
          <div className="w-full bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-3xl border border-white/80 rounded-[3rem] p-12 xl:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.05)] relative overflow-hidden">
            
            {/* Subtle Editorial Background Aura */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FFC461]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#FF7BA7]/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Editorial Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-black/5 pb-8 gap-6">
              <div>
                <span className="text-xs font-black tracking-[0.25em] uppercase text-[#D4AF37] block mb-2">
                  ✦ RESERVE COMMUNITY & DELIVERY
                </span>
                <h3 className="text-4xl xl:text-5xl font-black text-[#1A0B05] tracking-tight leading-[1.05]">
                  Connected Across Every Platform.
                </h3>
              </div>
              <p className="text-sm font-semibold text-gray-500 max-w-sm leading-relaxed">
                Connect with our community for secret drops, support, and 30-minute delivery.
              </p>
            </div>

            {/* 4 Equal-Height Frosted Glass Cards in One Beautiful 12-Column Row */}
            <div className="grid grid-cols-4 gap-8">
              
              {/* Instagram Card */}
              <motion.button 
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://www.instagram.com/popobobofficial?igsh=MWQ0a2trdmwycDdjMg==', '_blank')}
                className="relative h-64 rounded-[2.2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] flex flex-col justify-between p-8 group bg-white/70 backdrop-blur-2xl border border-gray-100 text-left transition-all"
              >
                <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 transform translate-x-12 -translate-y-12" />
                
                <div className="flex items-center justify-between w-full relative z-10">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-[#E1306C] group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </div>
                  <span className="bg-[#E1306C]/10 text-[#E1306C] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Official Page
                  </span>
                </div>

                <div className="relative z-10">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] block mb-1">Instagram</span>
                  <span className="text-[#1A0B05] font-black text-2xl tracking-tight block group-hover:text-[#E1306C] transition-colors">@POP O'BOB®</span>
                  <span className="text-xs font-semibold text-gray-500 mt-2 block">Daily editorial drops & secret menu stories</span>
                </div>
              </motion.button>

              {/* WhatsApp Card */}
              <motion.button 
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://wa.me/1234567890?text=Hi%20POP%20O%20BOB!', '_blank')}
                className="relative h-64 rounded-[2.2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] flex flex-col justify-between p-8 group bg-white/70 backdrop-blur-2xl border border-gray-100 text-left transition-all"
              >
                <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-[#128C7E] to-[#25D366] rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 transform translate-x-12 -translate-y-12" />
                
                <div className="flex items-center justify-between w-full relative z-10">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-[#25D366] group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <span className="bg-[#25D366]/10 text-[#25D366] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Concierge
                  </span>
                </div>

                <div className="relative z-10">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] block mb-1">WhatsApp</span>
                  <span className="text-[#1A0B05] font-black text-2xl tracking-tight block group-hover:text-[#25D366] transition-colors">Instant Chat</span>
                  <span className="text-xs font-semibold text-gray-500 mt-2 block">Direct support & instant table reservations</span>
                </div>
              </motion.button>

              {/* Swiggy Card */}
              <motion.button 
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://www.swiggy.com/city/hyderabad/pop-o-bob-bubble-tea-cafe', '_blank')}
                className="relative h-64 rounded-[2.2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] flex flex-col justify-between p-8 group bg-white/70 backdrop-blur-2xl border border-gray-100 text-left transition-all"
              >
                <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-[#FC8019] to-[#FD5E0F] rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 transform translate-x-12 -translate-y-12" />
                
                <div className="flex items-center justify-between w-full relative z-10">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-[#FC8019] font-black text-2xl group-hover:scale-110 transition-transform">
                    S
                  </div>
                  <span className="bg-[#FC8019]/10 text-[#FC8019] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    30-Min Delivery
                  </span>
                </div>

                <div className="relative z-10">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] block mb-1">Order On</span>
                  <span className="text-[#1A0B05] font-black text-2xl tracking-tight block group-hover:text-[#FC8019] transition-colors">Swiggy Gourmet</span>
                  <span className="text-xs font-semibold text-gray-500 mt-2 block">Priority thermal delivery to your doorstep</span>
                </div>
              </motion.button>

              {/* Zomato Card */}
              <motion.button 
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://www.zomato.com/hyderabad/restaurants/pop-obob-bubble-tea-cafe', '_blank')}
                className="relative h-64 rounded-[2.2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] flex flex-col justify-between p-8 group bg-white/70 backdrop-blur-2xl border border-gray-100 text-left transition-all"
              >
                <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-[#E23744] to-[#CB202D] rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 transform translate-x-12 -translate-y-12" />
                
                <div className="flex items-center justify-between w-full relative z-10">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-[#E23744] font-black text-2xl italic group-hover:scale-110 transition-transform">
                    Z
                  </div>
                  <span className="bg-[#E23744]/10 text-[#E23744] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Gold Dining
                  </span>
                </div>

                <div className="relative z-10">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] block mb-1">Order On</span>
                  <span className="text-[#1A0B05] font-black text-2xl tracking-tight block group-hover:text-[#E23744] transition-colors">Zomato Gold</span>
                  <span className="text-xs font-semibold text-gray-500 mt-2 block">Exclusive reserve perks & live delivery tracking</span>
                </div>
              </motion.button>

            </div>

            {/* Desktop Reviews Block inside Container */}
            <div className="mt-16 pt-12 border-t border-black/5">
              <div className="flex flex-col items-center">
                <span className="text-xs font-black tracking-[0.25em] uppercase text-[#FF9800] mb-2">
                  ✦ DISCOVER WHAT TASTEMAKERS SAY
                </span>
                <h4 className="text-3xl font-black text-[#1A0B05] tracking-tight mb-8">
                  Loved by Over 10,000+ Tea Artisans
                </h4>
                <div className="elfsight-app-a2d34f5a-63af-43a9-9dd6-98e16050776d w-full max-w-5xl" data-elfsight-app-lazy></div>
              </div>
            </div>

          </div>

          {/* Luxury Desktop Footer */}
          <footer className="mt-16 pt-12 pb-16 w-full flex flex-col items-center justify-center border-t border-black/5">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 border border-gray-200 shadow-md overflow-hidden">
              <img src="/assets/logo 2.png" alt="POP O'BOB® Logo" className="w-full h-full object-cover scale-110" />
            </div>
            
            <h2 className="text-2xl font-black tracking-tighter mb-6 text-[#1A0B05] uppercase">POP O'BOB® RESERVE</h2>
            
            <div className="flex items-center gap-8 mb-8">
              <button onClick={() => navigate('/menu')} className="text-xs font-bold text-gray-600 hover:text-[#1A0B05] uppercase tracking-widest transition-colors">Menu</button>
              <span className="text-gray-300">•</span>
              <button onClick={() => navigate('/offers')} className="text-xs font-bold text-gray-600 hover:text-[#1A0B05] uppercase tracking-widest transition-colors">Offers</button>
              <span className="text-gray-300">•</span>
              <button onClick={() => navigate('/pickup-locations')} className="text-xs font-bold text-gray-600 hover:text-[#1A0B05] uppercase tracking-widest transition-colors">Locations</button>
              <span className="text-gray-300">•</span>
              <button onClick={() => window.open('https://wa.me/1234567890?text=I%20need%20support!', '_blank')} className="text-xs font-bold text-gray-600 hover:text-[#1A0B05] uppercase tracking-widest transition-colors">Support</button>
            </div>
            
            <div className="flex flex-col items-center gap-1 opacity-75">
              <p className="text-[11px] font-black tracking-[0.25em] uppercase text-gray-500">
                © 2026 POP O'BOB® TEA CO. ALL RIGHTS RESERVED.
              </p>
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mt-1">
                DESIGNED FOR THE DISCERNING PALATE • CRAFTED WITH LUXURY PRECISION
              </p>
            </div>
          </footer>

        </div>
      </div>

    </div>
  );
}
