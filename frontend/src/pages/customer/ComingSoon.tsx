import React from 'react';
import { motion } from 'framer-motion';

import horizontalLogo from '../../assets/Horizontal Wordmark with Emblem.png';
import brandEmblem from '../../assets/Brand Emblem.png';
import bobaCupImage from '../../assets/boba-cup.png';
import honeydewCupImage from '../../assets/honeydew.png';

// Swiggy and Zomato direct URLs
const SWIGGY_URL = 'https://www.swiggy.com/city/hyderabad/pop-o-bob-bubble-tea-cafe';
const ZOMATO_URL = 'https://www.zomato.com/hyderabad/restaurants/pop-obob-bubble-tea-cafe';

// Decorative Organic Tea Leaf SVG
const TeaLeaf = ({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg 
    viewBox="0 0 64 64" 
    className={`fill-[#4A7C3A] pointer-events-none select-none ${className}`}
    style={style}
  >
    <path d="M58 8C52 18 42 24 30 26C18 28 8 22 2 16C6 28 14 38 24 44C34 50 48 48 58 40C62 36 64 26 64 16C64 12 62 10 58 8Z" />
    <path d="M2 16C18 28 36 34 58 40" stroke="#376029" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
  </svg>
);

// Floating Boba Pearls in the warm cream atmosphere
const AmbientBobaBubbles = () => {
  const bubbles = [
    { size: 14, left: '6%', delay: 0, duration: 8 },
    { size: 20, left: '14%', delay: 2.2, duration: 9 },
    { size: 10, left: '26%', delay: 1, duration: 7 },
    { size: 24, left: '38%', delay: 3, duration: 10 },
    { size: 16, left: '62%', delay: 1.8, duration: 8.5 },
    { size: 22, left: '74%', delay: 2.6, duration: 9.5 },
    { size: 12, left: '86%', delay: 0.6, duration: 7.2 },
    { size: 18, left: '94%', delay: 3.8, duration: 10.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          initial={{ y: '115vh', opacity: 0, scale: 0.8 }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.5, 0.5, 0],
            scale: [0.8, 1, 1, 0.85],
            x: [0, i % 2 === 0 ? 20 : -20, 0],
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
            background: 'radial-gradient(circle at 35% 35%, #F4A261, #8B4513 70%, #2B170B 100%)',
            boxShadow: '0 4px 15px rgba(139, 69, 19, 0.2)',
          }}
        />
      ))}
    </div>
  );
};

export default function ComingSoon() {
  return (
    <div className="relative min-h-screen bg-[#FDF8EE] text-[#1F1610] overflow-x-hidden font-sans flex flex-col items-center justify-between selection:bg-[#F9BF29] selection:text-black">
      
      {/* ========================================================================= */}
      {/* ORGANIC BACKGROUND WAVES & TEA LEAF ACCENTS */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
        
        {/* Top-Left Golden Yellow Fluid Shape */}
        <div 
          className="absolute -top-[10%] -left-[12%] w-[320px] sm:w-[480px] lg:w-[600px] h-[320px] sm:h-[480px] lg:h-[600px] rounded-full bg-gradient-to-br from-[#FCD34D] via-[#FBBF24] to-[#F59E0B] opacity-75 blur-[2px]"
          style={{
            clipPath: 'ellipse(70% 60% at 30% 30%)',
          }}
        />

        {/* Right Fluid Organic Curve */}
        <div 
          className="absolute top-[25%] -right-[15%] w-[300px] sm:w-[450px] lg:w-[550px] h-[380px] sm:h-[500px] lg:h-[650px] rounded-full bg-gradient-to-bl from-[#FDE68A] via-[#FCD34D] to-[#FBBF24] opacity-50 blur-[2px]"
          style={{
            clipPath: 'ellipse(60% 70% at 70% 50%)',
          }}
        />

        {/* Bottom-Left Golden Swirl Wave */}
        <div 
          className="absolute -bottom-[12%] -left-[15%] w-[350px] sm:w-[520px] lg:w-[650px] h-[350px] sm:h-[520px] lg:h-[650px] rounded-full bg-gradient-to-tr from-[#FCD34D] via-[#FBBF24] to-[#FDE68A] opacity-65"
          style={{
            clipPath: 'ellipse(70% 65% at 35% 65%)',
          }}
        />

        {/* Bottom-Right Golden Swirl Wave */}
        <div 
          className="absolute -bottom-[10%] -right-[10%] w-[260px] sm:w-[380px] h-[260px] sm:h-[380px] rounded-full bg-gradient-to-tl from-[#FBBF24] to-[#FDE68A] opacity-45"
        />

        {/* Blurred Fresh Green Tea Leaves at Perimeter (matching user reference image) */}
        <motion.div 
          animate={{ y: [0, 8, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[18%] -left-3 sm:left-4 z-10 w-16 sm:w-24 h-16 sm:h-24 opacity-80 blur-[0.6px]"
        >
          <TeaLeaf className="w-full h-full transform -rotate-45" />
        </motion.div>

        <motion.div 
          animate={{ y: [0, -10, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[6%] -right-4 sm:right-6 z-10 w-20 sm:w-28 h-20 sm:h-28 opacity-75 blur-[1px]"
        >
          <TeaLeaf className="w-full h-full transform rotate-[130deg]" />
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[28%] -right-5 sm:right-3 z-10 w-20 sm:w-28 h-20 sm:h-28 opacity-80 blur-[0.8px]"
        >
          <TeaLeaf className="w-full h-full transform rotate-[75deg]" />
        </motion.div>

        <motion.div 
          animate={{ y: [0, -8, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[10%] -left-4 sm:left-6 z-10 w-16 sm:w-22 h-16 sm:h-22 opacity-75 blur-[0.8px]"
        >
          <TeaLeaf className="w-full h-full transform rotate-12" />
        </motion.div>

      </div>

      {/* Floating boba bubbles */}
      <AmbientBobaBubbles />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER / BRAND LOGO (Centered as in reference poster) */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full pt-8 pb-4 px-4 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3"
        >
          {/* Logo container with fallback to horizontal or emblem */}
          <img 
            src={horizontalLogo} 
            alt="POP O' BOB - Specialty Bubble Tea" 
            className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-sm"
            onError={(e) => {
              // Fallback if horizontal logo fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </motion.div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN POSTER SECTION (Matching the exact uploaded design) */}
      {/* ========================================================================= */}
      <main className="relative z-10 w-full max-w-xl mx-auto px-4 py-2 sm:py-4 flex flex-col items-center text-center">
        
        {/* Top Sunburst Rays (above "Something New") */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-1 flex justify-center text-[#F59E0B]"
        >
          <svg className="w-8 h-4 sm:w-10 sm:h-5" viewBox="0 0 36 20" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
            <line x1="18" y1="2" x2="18" y2="8" />
            <line x1="7" y1="6" x2="12" y2="11" />
            <line x1="29" y1="6" x2="24" y2="11" />
          </svg>
        </motion.div>

        {/* Headline Row 1: "Something New" */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-[#1A0B05] tracking-tight leading-none italic font-['Outfit',sans-serif]"
        >
          Something New
        </motion.h1>

        {/* Headline Row 2: "Is Coming." with Yellow Badge and Side Rays */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex items-center justify-center gap-2 mt-2 mb-3"
        >
          <div className="bg-[#FFC938] px-5 sm:px-7 py-1 sm:py-1.5 rounded-2xl sm:rounded-3xl shadow-sm border border-[#F59E0B]/30 transform -rotate-1">
            <span className="text-4xl sm:text-5xl md:text-6xl font-black text-[#1A0B05] tracking-tight italic font-['Outfit',sans-serif] inline-block">
              Is Coming.
            </span>
          </div>

          {/* Right side sunbeam rays next to badge */}
          <div className="text-[#F59E0B] flex flex-col gap-1 pl-1">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
              <line x1="2" y1="7" x2="10" y2="8" />
              <line x1="2" y1="13" x2="10" y2="11" />
            </svg>
          </div>
        </motion.div>

        {/* Subtitle Description */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-base sm:text-lg text-[#3D2C20] font-medium leading-snug max-w-sm sm:max-w-md mx-auto mb-4 px-2"
        >
          We're upgrading your experience with new flavours and exciting offers.
        </motion.p>

        {/* "Coming Soon." Dark Brown Pill Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mb-5"
        >
          <div className="inline-block bg-[#231207] text-[#FFC938] px-7 py-2 rounded-full font-black text-sm sm:text-base tracking-wide shadow-md border border-[#3E2210]">
            Coming Soon.
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 3. CENTER DRINK SHOWCASE (Brown Sugar Boba cup with pedestal & accents) */}
        {/* ========================================================================= */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] my-1 flex flex-col items-center justify-center select-none"
        >
          {/* Subtle warm glow behind cup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-[#FCD34D] opacity-40 blur-3xl rounded-full pointer-events-none" />

          {/* Decorative Sparkle Rays on Right of Cup */}
          <div className="absolute right-0 top-1/3 text-[#F59E0B] pointer-events-none z-20">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
              <line x1="4" y1="18" x2="10" y2="14" />
              <line x1="8" y1="6" x2="12" y2="12" />
              <line x1="20" y1="12" x2="14" y2="12" />
            </svg>
          </div>

          {/* Boba Cup Image with subtle floating motion */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-full flex items-center justify-center drop-shadow-[0_18px_25px_rgba(43,23,11,0.25)]"
          >
            <img 
              src={bobaCupImage} 
              alt="Pop O' Bob Handcrafted Specialty Bubble Tea" 
              className="max-h-[260px] sm:max-h-[320px] md:max-h-[360px] w-auto object-contain"
              onError={(e) => {
                // Fallback to honeydew cup if needed
                (e.target as HTMLImageElement).src = honeydewCupImage;
              }}
            />
          </motion.div>

          {/* Marble Coaster / Base shadow */}
          <div className="w-3/4 h-3 bg-[#422919]/15 blur-md rounded-full mt-[-6px] z-0" />
        </motion.div>

        {/* ========================================================================= */}
        {/* 4. DELIVERY CALLOUT & ACTION BUTTONS */}
        {/* ========================================================================= */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="w-full max-w-sm sm:max-w-md mt-4 sm:mt-6 flex flex-col items-center"
        >
          {/* Headline: Craving boba? We're live on */}
          <h2 className="text-xl sm:text-2xl font-black italic text-[#1A0B05] tracking-tight mb-3 font-['Outfit',sans-serif]">
            Craving boba? We're live on
          </h2>

          {/* Side-by-side Swiggy & Zomato Delivery Buttons */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
            
            {/* SWIGGY BUTTON */}
            <motion.a
              href={SWIGGY_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex flex-col items-center justify-center py-3.5 px-4 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#FF7A00] to-[#E8590C] text-white shadow-lg shadow-orange-500/35 border border-orange-400/40 cursor-pointer overflow-hidden transition-all duration-300"
            >
              {/* Subtle light shine */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center gap-2 mb-1">
                {/* Swiggy Pin Emblem SVG */}
                <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 fill-white shrink-0 drop-shadow-sm">
                  <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>
                <span className="text-xl sm:text-2xl font-black tracking-tight leading-none drop-shadow-sm">
                  Swiggy
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-orange-100 opacity-95 group-hover:translate-x-0.5 transition-transform">
                <span>Order Now</span>
                <span className="text-xs">↗</span>
              </div>
            </motion.a>

            {/* ZOMATO BUTTON */}
            <motion.a
              href={ZOMATO_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex flex-col items-center justify-center py-3.5 px-4 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#E23744] to-[#B81D2B] text-white shadow-lg shadow-red-500/35 border border-red-400/40 cursor-pointer overflow-hidden transition-all duration-300"
            >
              {/* Subtle light shine */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center mb-1">
                <span className="text-2xl sm:text-3xl font-black italic tracking-tighter drop-shadow-sm font-sans">
                  zomato
                  <sup className="text-[10px] font-normal not-italic ml-0.5 opacity-90">®</sup>
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-red-100 opacity-95 group-hover:translate-x-0.5 transition-transform">
                <span>Order Now</span>
                <span className="text-xs">↗</span>
              </div>
            </motion.a>

          </div>

        </motion.div>

        {/* ========================================================================= */}
        {/* 5. FOOTER / TAGLINE (Heart & Elegant Slogan) */}
        {/* ========================================================================= */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="w-full max-w-sm mx-auto mt-6 sm:mt-8 mb-4 flex flex-col items-center"
        >
          {/* Heart icon with delicate accent dividers */}
          <div className="flex items-center justify-center gap-3 w-full mb-2 opacity-60">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#CBB69D] to-transparent" />
            <svg className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#CBB69D] to-transparent" />
          </div>

          {/* Slogan */}
          <p className="text-xs sm:text-sm italic font-medium text-[#6B5344] tracking-wide text-center">
            New flavours. Exciting offers. Same boba love.
          </p>
        </motion.div>

      </main>

      {/* Tiny bottom spacer */}
      <div className="h-4 pointer-events-none" />

    </div>
  );
}
