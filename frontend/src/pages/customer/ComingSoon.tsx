import React from 'react';
import { motion } from 'framer-motion';

import horizontalLogo from '../../assets/Horizontal Wordmark with Emblem.png';
import bobaCupPortrait from '../../assets/boba-cup-portrait.png';
import honeydewCupImage from '../../assets/honeydew.png';

// Swiggy and Zomato direct URLs
const SWIGGY_URL = 'https://www.swiggy.com/city/hyderabad/pop-o-bob-bubble-tea-cafe';
const ZOMATO_URL = 'https://www.zomato.com/hyderabad/restaurants/pop-obob-bubble-tea-cafe';

export default function ComingSoon() {
  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#1A0B05] overflow-x-hidden font-sans flex flex-col justify-between selection:bg-[#F3C644] selection:text-black">
      
      {/* ========================================================================= */}
      {/* SUBTLE MINIMAL AMBIENT GLOW (No harsh or cartoonish blobs) */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Soft, warm, diffused luxury light */}
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#FDE8B3]/50 to-transparent blur-[100px] rounded-full" />
        <div className="absolute top-[40%] left-[10%] w-[350px] h-[350px] bg-[#FED7AA]/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[#FEF08A]/25 blur-[130px] rounded-full" />
      </div>

      {/* ========================================================================= */}
      {/* 1. MINIMAL TOP NAVBAR */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full pt-8 pb-4 px-4 sm:px-8 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center"
        >
          <img 
            src={horizontalLogo} 
            alt="POP O' BOB - Specialty Bubble Tea" 
            className="h-9 sm:h-11 md:h-12 w-auto object-contain drop-shadow-sm" 
          />
        </motion.div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN MINIMAL CONTENT */}
      {/* ========================================================================= */}
      <main className="relative z-10 w-full max-w-lg mx-auto px-5 py-4 sm:py-6 flex flex-col items-center text-center">
        
        {/* Minimalist Status Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#EADBCE] shadow-sm backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5A93C] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D97706]" />
          </span>
          <span className="text-[11px] font-bold text-[#8C5E35] tracking-widest uppercase">
            Something New Is Coming
          </span>
        </motion.div>

        {/* Clean, Bold, Minimal Headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-[#1A0B05] tracking-tight leading-[1.05] font-['Outfit',sans-serif]">
            Something New
          </h1>
          <div className="mt-1 sm:mt-1.5 flex items-center justify-center gap-2">
            <span className="text-4xl sm:text-5xl font-black text-[#1A0B05] tracking-tight leading-[1.05] font-['Outfit',sans-serif]">
              Is Coming.
            </span>
          </div>
        </motion.div>

        {/* Minimal Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-sm sm:text-base text-[#6B5A4E] font-medium leading-relaxed max-w-sm sm:max-w-md mx-auto mt-3 mb-4"
        >
          We're upgrading your experience with new flavours and exciting offers.
        </motion.p>

        {/* Coming Soon Tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <div className="inline-block bg-[#1A0B05] text-[#F3C644] px-6 py-2 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-md">
            Coming Soon.
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 3. CENTERPIECE DRINK (Clean, Framed Portrait Card with Soft Shadow) */}
        {/* ========================================================================= */}
        <motion.div 
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="relative w-full max-w-[260px] sm:max-w-[300px] mb-7 select-none"
        >
          {/* Ambient soft glow */}
          <div className="absolute inset-0 bg-[#E5A93C]/20 rounded-[2.2rem] blur-2xl transform scale-95 pointer-events-none" />

          {/* Framed Drink Portrait Card */}
          <motion.div 
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full aspect-[3/4] rounded-[2.2rem] overflow-hidden shadow-[0_20px_45px_-12px_rgba(26,11,5,0.18)] border border-white/60 bg-white"
          >
            <img 
              src={bobaCupPortrait} 
              alt="Pop O' Bob Handcrafted Specialty Bubble Tea" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = honeydewCupImage;
              }}
            />
          </motion.div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 4. DELIVERY CALLOUT & BUTTONS */}
        {/* ========================================================================= */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="w-full max-w-sm sm:max-w-md flex flex-col items-center"
        >
          {/* Heading */}
          <h2 className="text-lg sm:text-xl font-bold italic text-[#1A0B05] tracking-tight mb-3 font-['Outfit',sans-serif]">
            Craving boba? We're live on
          </h2>

          {/* Side-by-side Swiggy & Zomato Delivery Buttons */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
            
            {/* SWIGGY BUTTON */}
            <motion.a
              href={SWIGGY_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex flex-col items-center justify-center py-3.5 px-4 rounded-2xl bg-[#FC8019] hover:bg-[#E56A05] text-white shadow-lg shadow-orange-500/25 cursor-pointer overflow-hidden transition-all duration-200"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                {/* Swiggy Pin Icon */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0">
                  <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>
                <span className="text-xl sm:text-2xl font-black tracking-tight leading-none">
                  Swiggy
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-orange-100 group-hover:translate-x-0.5 transition-transform">
                <span>Order Now</span>
                <span className="text-xs">↗</span>
              </div>
            </motion.a>

            {/* ZOMATO BUTTON */}
            <motion.a
              href={ZOMATO_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex flex-col items-center justify-center py-3.5 px-4 rounded-2xl bg-[#E23744] hover:bg-[#C9222F] text-white shadow-lg shadow-red-500/25 cursor-pointer overflow-hidden transition-all duration-200"
            >
              <div className="flex items-center mb-0.5">
                <span className="text-2xl sm:text-[26px] font-black italic tracking-tighter font-sans leading-none">
                  zomato
                  <sup className="text-[9px] font-normal not-italic ml-0.5 opacity-90">®</sup>
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-red-100 group-hover:translate-x-0.5 transition-transform">
                <span>Order Now</span>
                <span className="text-xs">↗</span>
              </div>
            </motion.a>

          </div>

        </motion.div>

        {/* ========================================================================= */}
        {/* 5. MINIMAL FOOTER / TAGLINE */}
        {/* ========================================================================= */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="w-full max-w-sm mx-auto mt-6 sm:mt-8 mb-2 flex flex-col items-center"
        >
          {/* Subtle Heart & Tagline */}
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="text-sm">💛</span>
          </div>

          <p className="text-xs sm:text-sm italic font-medium text-[#7D6B5F] tracking-wide text-center">
            New flavours. Exciting offers. Same boba love.
          </p>

          <p className="text-[10px] text-[#A8988C] mt-4 font-normal">
            © {new Date().getFullYear()} Pop O' Bob. All rights reserved.
          </p>
        </motion.div>

      </main>

      {/* Tiny spacing */}
      <div className="h-4 pointer-events-none" />

    </div>
  );
}
