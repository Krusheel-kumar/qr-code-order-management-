import React from 'react';
import { motion } from 'framer-motion';

import horizontalLogo from '../../assets/logo-wordmark-tight.png';
import chocolateTeaCoaster from '../../assets/chocolate-tea-coaster.png';
import honeydewCupImage from '../../assets/honeydew.png';

// Swiggy and Zomato direct URLs
const SWIGGY_URL = 'https://www.swiggy.com/city/hyderabad/pop-o-bob-bubble-tea-cafe';
const ZOMATO_URL = 'https://www.zomato.com/hyderabad/restaurants/pop-obob-bubble-tea-cafe';

// Joyful Sparkle / Burst Rays Accent (as shown in poster reference)
function SparkleBurst({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line x1="25.7" y1="33.2" x2="34.3" y2="11.8" stroke="#F8B919" strokeWidth="8" strokeLinecap="round" />
      <line x1="43.2" y1="48.4" x2="61.8" y2="31.6" stroke="#F8B919" strokeWidth="8" strokeLinecap="round" />
      <line x1="48.8" y1="70.3" x2="71.2" y2="64.7" stroke="#F8B919" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export default function ComingSoon() {
  React.useEffect(() => {
    document.title = "Pop O’ Bob® | Specialty Bubble Tea & Online Ordering";
  }, []);

  return (
    <div className="relative min-h-screen bg-[#FFF8EE] text-[#1A0B05] overflow-x-hidden font-sans flex flex-col justify-between selection:bg-[#F3C644] selection:text-black">
      
      {/* ========================================================================= */}
      {/* 1. BRAND HEADER AT TOP */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full pt-6 sm:pt-8 pb-2 sm:pb-4 px-4 sm:px-8 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center"
        >
          <img 
            src={horizontalLogo} 
            alt="Pop O’ Bob official logo - Specialty Bubble Tea" 
            className="w-36 sm:w-40 md:w-44 h-auto object-contain drop-shadow-sm select-none" 
          />
        </motion.div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT (Responsive: 2-column on Desktop, Centered on Mobile) */}
      {/* ========================================================================= */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 py-4 sm:py-6 lg:py-8 flex-1 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center w-full">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN (DESKTOP) / TOP SECTION (MOBILE) */}
          {/* ===================================================================== */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Headline Hierarchy: One clear H1 followed by H2 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-center lg:items-start"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-[#140804] tracking-[-0.03em] leading-[1.12] font-['Outfit',sans-serif]">
                Specialty Bubble Tea by Pop O’ Bob
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#D97706] tracking-tight mt-2 font-['Outfit',sans-serif]">
                Something New Is Coming.
              </h2>
            </motion.div>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base lg:text-lg text-[#6E594B] font-medium leading-relaxed max-w-sm sm:max-w-md mt-4 mb-4"
            >
              We're upgrading your experience with new flavours and exciting offers.
            </motion.p>

            {/* Coming Soon Pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mb-6 lg:mb-8"
            >
              <div className="inline-block bg-[#1A0B05] text-[#FFD54F] px-6 sm:px-7 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md">
                Coming Soon
              </div>
            </motion.div>

            {/* ================================================================= */}
            {/* DESKTOP-ONLY DELIVERY BUTTONS (Placed directly under info on left) */}
            {/* ================================================================= */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="hidden lg:flex flex-col items-start w-full max-w-md"
            >
              <h3 className="text-lg sm:text-xl font-bold italic text-[#1A0B05] tracking-tight mb-3 font-['Outfit',sans-serif]">
                Craving boba? We're live on
              </h3>

              <div className="grid grid-cols-2 gap-4 w-full">
                
                {/* SWIGGY BUTTON */}
                <motion.a
                  href={SWIGGY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Order Pop O’ Bob on Swiggy"
                  title="Order Pop O’ Bob on Swiggy"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative flex flex-col items-center justify-center py-3.5 px-4 rounded-2xl bg-[#FC8019] hover:bg-[#E56A05] text-white shadow-lg shadow-orange-500/20 cursor-pointer overflow-hidden transition-all duration-200"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
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
                  className="group relative flex flex-col items-center justify-center py-3.5 px-4 rounded-2xl bg-[#E23744] hover:bg-[#C9222F] text-white shadow-lg shadow-red-500/20 cursor-pointer overflow-hidden transition-all duration-200"
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

          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN (DESKTOP) / CENTER SECTION (MOBILE): DRINK ON PEDESTAL   */}
          {/* Directly on warm cream background with subtle natural shadow         */}
          {/* ===================================================================== */}
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex justify-center items-center w-full select-none"
          >
            <div className="relative w-full max-w-[270px] sm:max-w-[330px] lg:max-w-[400px] flex justify-center items-center">
              <img 
                src={chocolateTeaCoaster} 
                alt="Pop O’ Bob handcrafted specialty bubble tea on wooden pedestal" 
                className="w-full h-auto object-contain drop-shadow-[0_16px_24px_rgba(50,20,5,0.12)] transition-transform duration-300 hover:scale-[1.02]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = honeydewCupImage;
                }}
              />

              {/* Sparkle / Burst Rays Accent at Top-Right of Drink (as in reference poster) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: [1, 1.1, 1] }}
                transition={{ 
                  opacity: { duration: 0.5, delay: 0.4 },
                  scale: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute -top-3 right-0 sm:-top-4 sm:right-2 lg:-top-5 lg:right-3 w-11 h-11 sm:w-13 sm:h-13 lg:w-15 lg:h-15 pointer-events-none select-none z-20"
              >
                <SparkleBurst className="w-full h-full drop-shadow-sm" />
              </motion.div>
            </div>
          </motion.div>

          {/* ===================================================================== */}
          {/* MOBILE-ONLY DELIVERY BUTTONS (Placed after the drink on mobile)       */}
          {/* ===================================================================== */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex lg:hidden flex-col items-center w-full max-w-sm mx-auto -mt-1 mb-2"
          >
            <h3 className="text-lg sm:text-xl font-bold italic text-[#1A0B05] tracking-tight mb-3 font-['Outfit',sans-serif] text-center">
              Craving boba? We're live on
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
              
              {/* SWIGGY BUTTON */}
              <motion.a
                href={SWIGGY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Order Pop O’ Bob on Swiggy"
                title="Order Pop O’ Bob on Swiggy"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex flex-col items-center justify-center py-3.5 px-4 rounded-2xl bg-[#FC8019] hover:bg-[#E56A05] text-white shadow-lg shadow-orange-500/20 cursor-pointer overflow-hidden transition-all duration-200"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
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
                className="group relative flex flex-col items-center justify-center py-3.5 px-4 rounded-2xl bg-[#E23744] hover:bg-[#C9222F] text-white shadow-lg shadow-red-500/20 cursor-pointer overflow-hidden transition-all duration-200"
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

        </div>

        {/* ========================================================================= */}
        {/* 3. MINIMAL FOOTER / TAGLINE */}
        {/* ========================================================================= */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full max-w-sm mx-auto mt-8 sm:mt-12 mb-2 flex flex-col items-center"
        >
          {/* Subtle Heart & Tagline */}
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="text-sm">💛</span>
          </div>

          <p className="text-xs sm:text-sm italic font-medium text-[#7D6B5F] tracking-wide text-center">
            New flavours. Exciting offers. Same boba love.
          </p>

          <p className="text-[10px] text-[#A8988C] mt-3 font-normal">
            © {new Date().getFullYear()} Pop O' Bob. All rights reserved.
          </p>
        </motion.div>

      </main>

      {/* Subtle bottom spacing */}
      <div className="h-2 pointer-events-none" />

    </div>
  );
}
