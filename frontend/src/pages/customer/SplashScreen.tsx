import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import brandEmblem from '../../assets/Brand Emblem.png';
import wordmarkLogo from '../../assets/Wordmark Logo.png';
import tagline from '../../assets/Tagline.png';
import nineYears from '../../assets/9 years.png';
import horizontalWordmark from '../../assets/Horizontal Wordmark with Emblem.png';

const Confetti = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: -50, x: Math.random() * window.innerWidth, opacity: 0, rotate: 0 }}
        animate={{ 
          y: window.innerHeight + 50, 
          x: `calc(${Math.random() * 100}vw)`,
          opacity: [0, 1, 1, 0],
          rotate: 360 
        }}
        transition={{ 
          duration: 3 + Math.random() * 2, 
          repeat: Infinity, 
          delay: Math.random() * 2,
          ease: "linear"
        }}
        className="absolute w-2 h-6 bg-[#FFC461] rounded-full opacity-60"
        style={{
          width: Math.random() > 0.5 ? '8px' : '12px',
          height: Math.random() > 0.5 ? '16px' : '24px',
          backgroundColor: Math.random() > 0.5 ? '#FFC461' : '#FDE68A'
        }}
      />
    ))}
  </div>
);

export default function SplashScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    // Increased the animation phases so users can fully see and read the content
    const p2 = setTimeout(() => setPhase(2), 3500); // 9 Years Screen
    const p3 = setTimeout(() => setPhase(3), 7000); // Thank you screen
    const finish = setTimeout(() => navigate('/home'), 10500); // Finish
    
    return () => {
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(finish);
    };
  }, [navigate]);

  return (
    <div className="min-h-[100dvh] bg-[#FFF8EE] flex flex-col items-center justify-center relative overflow-hidden font-poppins selection:bg-transparent">
      
      {/* Background glow */}
      <div className="absolute top-[10%] left-[10%] w-[60%] h-[60%] bg-white blur-[100px] opacity-60 rounded-full z-0" />
      <div className="absolute bottom-[0%] right-[0%] w-[100%] h-[40%] bg-[#FFEAC5] blur-[100px] opacity-40 rounded-t-[100%] z-0" />
      
      {phase > 1 && <Confetti />}

      <AnimatePresence mode="wait">
        
        {/* PHASE 1: Logo Intro */}
        {phase === 1 && (
          <motion.div
            key="phase1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="z-20 flex flex-col items-center w-full max-w-sm px-6"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-40 mb-10 drop-shadow-2xl" /* Increased from w-32 */
            >
              <img src={brandEmblem} alt="POB Emblem" className="w-full h-auto object-contain" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-72 mb-5" /* Increased from w-56 */
            >
              <img src={wordmarkLogo} alt="popobob" className="w-full h-auto object-contain" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="w-60" /* Increased from w-48 */
            >
              <img src={tagline} alt="Specialty Bubble Tea" className="w-full h-auto object-contain opacity-80" />
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 2: 9 Years Celebration */}
        {phase === 2 && (
          <motion.div
            key="phase2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="z-20 flex flex-col items-center w-full max-w-sm px-6 text-center"
          >
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl text-[#5C3D2E] mb-8 tracking-wide font-medium" /* Increased text size */
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Celebrating
            </motion.h2>

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.4 }}
              className="w-80 relative mb-8" /* Increased from w-64 */
            >
              <div className="absolute inset-0 bg-[#FFC461] blur-[50px] opacity-30 rounded-full scale-150 animate-pulse"></div>
              <img src={nineYears} alt="9 Years" className="w-full h-auto object-contain drop-shadow-2xl relative z-10" />
            </motion.div>

            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-3xl text-[#D97706] italic font-medium" /* Increased text size */
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              of bubble joy!
            </motion.h3>
          </motion.div>
        )}

        {/* PHASE 3: Thank You */}
        {phase === 3 && (
          <motion.div
            key="phase3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="z-20 flex flex-col items-center w-full max-w-sm px-6 text-center h-full justify-center mt-[-5vh]"
          >
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-56 mb-12 opacity-90" /* Increased from w-40 */
            >
              <img src={horizontalWordmark} alt="popobob" className="w-full h-auto object-contain" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-6xl text-[#C2410C] font-semibold mb-6 italic" /* Increased from text-5xl */
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Thank you
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-xl text-[#5C3D2E] font-medium max-w-[220px]" /* Increased from text-lg */
            >
              for being a part of our journey!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-12 bg-[#FFC461] text-[#5C3D2E] px-10 py-4 rounded-full font-bold shadow-lg flex items-center gap-3 text-lg" /* Made button larger */
            >
              Let's Pop! 
              <span className="text-2xl">→</span>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Persistent Floor Shadow for depth */}
      <div className="absolute bottom-[-10%] w-[150%] h-[30%] bg-[#FFC461] blur-[120px] opacity-20 rounded-full z-0 pointer-events-none" />
      
    </div>
  );
}
