import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ExternalLink, MapPin, Instagram, MessageCircle, Heart, ArrowUpRight } from 'lucide-react';

import brandEmblem from '../../assets/Brand Emblem.png';
import wordmarkLogo from '../../assets/Wordmark Logo.png';
import heroBanner from '../../assets/herobanner1.png';
import demoImage from '../../assets/demo.png';

// Swiggy and Zomato direct URLs
const SWIGGY_URL = 'https://www.swiggy.com/city/hyderabad/pop-o-bob-bubble-tea-cafe';
const ZOMATO_URL = 'https://www.zomato.com/hyderabad/restaurants/pop-obob-bubble-tea-cafe';
const INSTAGRAM_URL = 'https://www.instagram.com/popobobofficial?igsh=MWQ0a2trdmwycDdjMg==';
const WHATSAPP_URL = 'https://wa.me/919999999999?text=Hi%20Pop%20O%20Bob!';

// Floating Boba Pearl particles animation
const BobaBubbles = () => {
  const bubbles = [
    { size: 14, left: '8%', delay: 0, duration: 7 },
    { size: 22, left: '18%', delay: 2, duration: 8.5 },
    { size: 10, left: '30%', delay: 1, duration: 6 },
    { size: 28, left: '42%', delay: 3.5, duration: 9 },
    { size: 16, left: '55%', delay: 1.5, duration: 7.5 },
    { size: 24, left: '68%', delay: 2.8, duration: 8 },
    { size: 12, left: '82%', delay: 0.5, duration: 6.5 },
    { size: 20, left: '92%', delay: 4, duration: 9.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          initial={{ y: '110vh', opacity: 0, scale: 0.8 }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.45, 0.45, 0],
            scale: [0.8, 1, 1, 0.9],
            x: [0, i % 2 === 0 ? 25 : -25, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full"
          style={{
            left: b.left,
            width: `${b.size}px`,
            height: `${b.size}px`,
            background: 'radial-gradient(circle at 30% 30%, #FFE082, #B78103 60%, #1A0B05 100%)',
            boxShadow: '0 0 20px rgba(255, 193, 7, 0.25)',
          }}
        />
      ))}
    </div>
  );
};

export default function ComingSoon() {
  const outlets = [
    'Flip Side Adventure Park',
    'Manikonda',
    'Film Nagar',
    'Inorbit Mall',
    'Sharath City Mall',
  ];

  return (
    <div className="relative min-h-screen bg-[#0D0B0A] text-white overflow-x-hidden font-sans flex flex-col justify-between selection:bg-[#FFD54F] selection:text-black">
      
      {/* Background Ambience & Lighting */}
      <div className="fixed inset-0 pointer-events-none select-none z-0">
        {/* Soft radial glow orbs */}
        <div className="absolute -top-[15%] left-[10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-[#FF9933] opacity-20 blur-[150px] rounded-full" />
        <div className="absolute top-[40%] -right-[10%] w-[450px] md:w-[650px] h-[450px] md:h-[650px] bg-[#E23744] opacity-15 blur-[160px] rounded-full" />
        <div className="absolute -bottom-[15%] left-[25%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-[#FFD54F] opacity-15 blur-[180px] rounded-full" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Floating boba bubbles */}
      <BobaBubbles />

      {/* ========================================================================= */}
      {/* TOP NAVBAR (Both Desktop & Mobile) */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-5 border-b border-white/10 backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo brand group */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 sm:gap-4"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full p-1 bg-gradient-to-tr from-[#FFD54F] to-[#FF9933] shadow-lg shadow-yellow-500/20 flex items-center justify-center">
              <img src={brandEmblem} alt="Pop O' Bob" className="w-full h-full object-contain drop-shadow" />
            </div>
            <div className="flex flex-col">
              <img src={wordmarkLogo} alt="Pop O' Bob" className="h-5 sm:h-6 w-auto object-contain brightness-125" />
              <span className="text-[9px] sm:text-[11px] font-bold text-[#FFD54F] tracking-[0.2em] uppercase mt-0.5">
                Good Times Repeat
              </span>
            </div>
          </motion.div>

          {/* Live Kitchen Status Pill */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold shadow-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="hidden sm:inline">Kitchens Live for Delivery</span>
            <span className="sm:hidden">Kitchens Live</span>
          </motion.div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-16 flex flex-col justify-center">
        
        {/* ========================================================================= */}
        {/* DESKTOP VIEWPORT (lg:grid 2 columns) */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Swiggy/Zomato Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Glowing Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/15 via-orange-500/15 to-red-500/15 border border-yellow-500/30 text-yellow-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg shadow-yellow-500/10">
              <Sparkles size={14} className="text-yellow-400 animate-spin" style={{ animationDuration: '4s' }} />
              Something New Is Coming
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-white font-['Outfit',sans-serif]">
              We Are Upgrading <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD54F] via-[#FFA726] to-[#FF7043] drop-shadow-sm">
                Your Experience.
              </span>
            </h1>

            {/* Description Paragraph */}
            <p className="text-lg xl:text-xl text-gray-300 leading-relaxed font-normal mb-8 max-w-xl">
              We're cooking up something big! An elevated digital ordering platform with handcrafted new flavours, fresh boba creations, and exciting exclusive offers is coming very soon.
            </p>

            {/* Still Live On Announcement Box */}
            <div className="w-full max-w-xl p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-8">
              <div className="flex items-center gap-2 text-yellow-400 text-sm font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                Still Live for Orders
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                While our web ordering gets revamped, our kitchens are actively preparing your favourite drinks! Order instantly on Swiggy and Zomato below.
              </p>
            </div>

            {/* The Swiggy & Zomato Delivery Cards */}
            <div className="grid grid-cols-2 gap-5 w-full max-w-xl">
              
              {/* SWIGGY CARD */}
              <motion.a
                href={SWIGGY_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-b from-[#25160E] to-[#160D07] border border-[#FC8019]/40 hover:border-[#FC8019] shadow-xl hover:shadow-[#FC8019]/25 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FC8019]/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FC8019] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-orange-500/40 group-hover:scale-110 transition-transform">
                      S
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                      Live Delivery <ArrowUpRight size={12} />
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Order On</span>
                  <h3 className="text-2xl font-black text-white group-hover:text-orange-300 transition-colors">
                    Swiggy
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Lightning fast delivery to your location
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs font-bold text-[#FC8019] border-t border-white/5 pt-3 group-hover:translate-x-1 transition-transform">
                  <span>Open Swiggy</span>
                  <ExternalLink size={14} />
                </div>
              </motion.a>

              {/* ZOMATO CARD */}
              <motion.a
                href={ZOMATO_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-b from-[#281113] to-[#180A0B] border border-[#E23744]/40 hover:border-[#E23744] shadow-xl hover:shadow-[#E23744]/25 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#E23744]/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E23744] text-white flex items-center justify-center font-black text-2xl italic shadow-lg shadow-red-500/40 group-hover:scale-110 transition-transform">
                      Z
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                      Live Delivery <ArrowUpRight size={12} />
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Order On</span>
                  <h3 className="text-2xl font-black text-white group-hover:text-red-300 transition-colors">
                    Zomato
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Freshly handcrafted boba & exclusive deals
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs font-bold text-[#E23744] border-t border-white/5 pt-3 group-hover:translate-x-1 transition-transform">
                  <span>Open Zomato</span>
                  <ExternalLink size={14} />
                </div>
              </motion.a>

            </div>

          </motion.div>

          {/* Right Column: Visual Product Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Visual Card Frame */}
            <div className="relative w-full max-w-md aspect-[4/5] rounded-[2.5rem] bg-gradient-to-b from-white/10 to-white/5 border border-white/20 p-6 shadow-2xl backdrop-blur-2xl flex flex-col justify-between overflow-hidden">
              
              {/* Background cup image preview */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={heroBanner} 
                  alt="Pop O' Bob drinks" 
                  className="w-full h-full object-cover scale-105 opacity-50 blur-[1px]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>

              {/* Floating feature pills on showcase */}
              <div className="relative z-10 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-yellow-300 flex items-center gap-1.5 shadow-md">
                  ✨ 20+ Premium Flavours
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md">
                  🧋 100% Fresh Brewed Daily
                </span>
              </div>

              {/* Center product floating presentation */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 flex justify-center my-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]"
              >
                <img 
                  src={demoImage} 
                  alt="Signature Boba" 
                  className="max-h-64 object-contain" 
                />
              </motion.div>

              {/* Bottom Card Footer */}
              <div className="relative z-10 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10">
                <p className="text-xs font-bold text-[#FFD54F] uppercase tracking-wider mb-1">
                  Craving Something Special?
                </p>
                <p className="text-xs text-gray-300">
                  Tap Swiggy or Zomato on the left for doorstep delivery within minutes!
                </p>
              </div>

            </div>
          </motion.div>

        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEWPORT (block lg:hidden) */}
        {/* ========================================================================= */}
        <div className="block lg:hidden flex flex-col items-center text-center">
          
          {/* Animated Tagline Pill */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/15 via-orange-500/15 to-red-500/15 border border-yellow-500/30 text-yellow-300 text-[11px] font-bold uppercase tracking-wider mb-4 backdrop-blur-md shadow-md"
          >
            <Sparkles size={13} className="text-yellow-400 animate-spin" style={{ animationDuration: '4s' }} />
            Something New Is Coming
          </motion.div>

          {/* Mobile Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-3 text-white font-['Outfit',sans-serif]"
          >
            We Are Upgrading <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD54F] via-[#FFA726] to-[#FF7043]">
              Your Experience.
            </span>
          </motion.h1>

          {/* Mobile Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-300 leading-relaxed font-normal mb-6 max-w-sm px-2"
          >
            We are upgrading your experience with new flavours and existing offers coming soon!
          </motion.p>

          {/* Floating drink showcase thumbnail on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="relative w-full max-w-xs mb-6 rounded-3xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-xl p-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-black/40 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                <img src={demoImage} alt="Boba" className="w-full h-full object-contain p-1" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Kitchens Active Now
                </span>
                <span className="text-sm font-bold text-white block">
                  Pop O' Bob Bubble Tea
                </span>
                <span className="text-xs text-gray-400 block mt-0.5">
                  Available for Delivery on Swiggy & Zomato
                </span>
              </div>
            </div>
          </motion.div>

          {/* Mobile Swiggy & Zomato Action Cards */}
          <div className="w-full max-w-sm flex flex-col gap-3.5 mb-6">
            
            {/* SWIGGY MOBILE BUTTON */}
            <motion.a
              href={SWIGGY_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#FC8019] to-[#E56A05] text-white shadow-lg shadow-orange-500/30 font-bold border border-orange-400/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#FC8019] flex items-center justify-center font-black text-xl shadow-md">
                  S
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-wider text-orange-100 block font-semibold leading-none mb-0.5">
                    Order Delivery on
                  </span>
                  <span className="text-lg font-black text-white leading-tight">
                    Swiggy
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs bg-black/20 px-3 py-1.5 rounded-full">
                <span>Order Now</span>
                <ArrowUpRight size={14} />
              </div>
            </motion.a>

            {/* ZOMATO MOBILE BUTTON */}
            <motion.a
              href={ZOMATO_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#E23744] to-[#C9222F] text-white shadow-lg shadow-red-500/30 font-bold border border-red-400/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#E23744] flex items-center justify-center font-black text-xl italic shadow-md">
                  Z
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-wider text-red-100 block font-semibold leading-none mb-0.5">
                    Order Delivery on
                  </span>
                  <span className="text-lg font-black text-white leading-tight">
                    Zomato
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs bg-black/20 px-3 py-1.5 rounded-full">
                <span>Order Now</span>
                <ArrowUpRight size={14} />
              </div>
            </motion.a>

          </div>

          {/* Social Quick Links on Mobile */}
          <div className="flex items-center gap-3 mb-4">
            <a 
              href={INSTAGRAM_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 flex items-center gap-1.5 hover:text-white"
            >
              <Instagram size={14} className="text-pink-400" />
              <span>@POPOBOB</span>
            </a>
            <a 
              href={WHATSAPP_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 flex items-center gap-1.5 hover:text-white"
            >
              <MessageCircle size={14} className="text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* FOOTER BAR (Outlets & Copyright) */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full px-4 sm:px-8 py-6 border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          {/* Outlets List */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-1 font-semibold text-yellow-400 mr-1">
              <MapPin size={13} /> Our Outlets:
            </span>
            {outlets.map((outlet, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-gray-300"
              >
                {outlet}
              </span>
            ))}
          </div>

          {/* Copyright & Social */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>© {new Date().getFullYear()} Pop O' Bob. All rights reserved.</span>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
              <Instagram size={16} />
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}
