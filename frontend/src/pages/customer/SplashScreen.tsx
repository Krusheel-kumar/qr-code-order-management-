import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import brandEmblem from '../../assets/Brand Emblem.png';
import wordmarkLogo from '../../assets/Wordmark Logo.png';

const AshokaChakra = () => (
  <svg
    viewBox="0 0 100 100"
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.2] pointer-events-none"
    style={{ animation: 'spin 20s linear infinite' }}
  >
    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
    {[...Array(24)].map((_, i) => (
      <line
        key={i}
        x1="50"
        y1="50"
        x2="50"
        y2="2"
        stroke="currentColor"
        strokeWidth="1"
        transform={`rotate(${i * 15} 50 50)`}
      />
    ))}
  </svg>
);

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        initial={{
          y: Math.random() * window.innerHeight,
          x: Math.random() * window.innerWidth,
          opacity: 0,
          scale: Math.random() * 0.5 + 0.5,
        }}
        animate={{
          y: [null, Math.random() * window.innerHeight - 100],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 5 + Math.random() * 5,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 2,
        }}
        className="absolute rounded-full"
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: i % 3 === 0 ? '#FF9933' : i % 3 === 1 ? '#FFFFFF' : '#138808',
          boxShadow: `0 0 15px 2px ${i % 3 === 0 ? '#FF9933' : i % 3 === 1 ? '#FFFFFF' : '#138808'}`,
        }}
      />
    ))}
  </div>
);

export default function SplashScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    // Phase 1: Logo (0 to 1.5s)
    const p2 = setTimeout(() => setPhase(2), 1500); // Transition to Independence message
    const finish = setTimeout(() => navigate('/home'), 6000); // Finish at 6s
    
    return () => {
      clearTimeout(p2);
      clearTimeout(finish);
    };
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="min-h-[100dvh] bg-[#111111] flex flex-col items-center justify-center relative overflow-hidden font-poppins selection:bg-transparent"
    >
      {/* Tricolor Gradient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FF9933] blur-[120px] opacity-[0.4] rounded-full z-0" />
      <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-white blur-[100px] opacity-[0.25] rounded-full z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#138808] blur-[120px] opacity-[0.4] rounded-full z-0" />
      
      <FloatingParticles />

      <AnimatePresence mode="wait">
        
        {/* PHASE 1: Logo Intro */}
        {phase === 1 && (
          <motion.div
            key="phase1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="z-20 flex flex-col items-center w-full max-w-sm px-6"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-40 mb-6 drop-shadow-2xl brightness-110"
            >
              <img src={brandEmblem} alt="POB Emblem" className="w-full h-auto object-contain" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-64 brightness-110"
            >
              <img src={wordmarkLogo} alt="popobob" className="w-full h-auto object-contain" />
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 2: Independence Day Message */}
        {phase === 2 && (
          <motion.div
            key="phase2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="z-20 flex flex-col items-center w-full max-w-sm md:max-w-2xl px-6 text-center relative"
          >
            <AshokaChakra />
            
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-[32px] md:text-[56px] font-black tracking-tighter mb-5 md:mb-8 relative z-10 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-2xl"
            >
              <span className="block text-4xl md:text-6xl mb-2 md:mb-4 drop-shadow-none">🇮🇳</span>
              Happy<br className="md:hidden" /> Independence<br className="md:hidden" /> Day
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative z-10 flex flex-col items-center gap-4 mt-2 md:mt-4"
            >
              <p className="text-[#FF9933] text-[12px] md:text-base font-black tracking-[0.2em] md:tracking-[0.4em] uppercase drop-shadow-md">
                Celebrating India's 80th Independence Day
              </p>
              
              <div className="w-16 md:w-24 h-[1px] bg-white/20 my-1 md:my-3"></div>
              
              <p className="text-white text-base md:text-2xl font-bold tracking-wide drop-shadow-md">
                Celebrate Freedom with Every Sip.
              </p>
              
              <p className="text-[#138808] text-[10px] md:text-sm font-black mt-4 md:mt-6 tracking-[0.4em] uppercase opacity-90">
                — Team Pop O' Bob
              </p>
            </motion.div>
            
            {/* Shimmer sweep effect */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '200%', opacity: 0.3 }}
              transition={{ delay: 1.5, duration: 2, ease: 'easeInOut' }}
              className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 z-0 pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
