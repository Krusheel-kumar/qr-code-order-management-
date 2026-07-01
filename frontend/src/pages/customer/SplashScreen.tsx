import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Sparkle = ({ delay, top, left, size }: { delay: number; top: string; left: string; size: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
    transition={{ duration: 3, delay, repeat: Infinity, ease: "easeInOut" }}
    className="absolute bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]"
    style={{ top, left, width: size, height: size }}
  />
);

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 4500); // Shorter duration for minimalist screen
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[100dvh] bg-[#FFF6ED] flex flex-col items-center justify-center relative overflow-hidden font-poppins selection:bg-transparent">
      
      {/* Background Sparkles & Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-white blur-[80px] opacity-40 rounded-full" />
        <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-[#FFE5C1] blur-[80px] opacity-30 rounded-full" />
        
        {/* Subtle twinkling stars */}
        <Sparkle delay={0.2} top="15%" left="30%" size={3} />
        <Sparkle delay={1.5} top="25%" left="70%" size={4} />
        <Sparkle delay={0.8} top="65%" left="20%" size={3} />
        <Sparkle delay={2.2} top="75%" left="80%" size={4} />
        <Sparkle delay={1.1} top="40%" left="85%" size={2} />
        <Sparkle delay={0.5} top="50%" left="10%" size={3} />
      </div>

      {/* Main Content Reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="z-20 flex flex-col items-center mt-[-5vh]"
      >
        {/* Exact Logo Image */}
        <div className="w-[120px] h-[120px] mb-6 rounded-full overflow-hidden drop-shadow-2xl flex items-center justify-center bg-[#1A1A1A]">
          <img src="/assets/logo 2.png" alt="POB Logo" className="w-[140%] h-[140%] object-cover" />
        </div>
        
        {/* Brand Text */}
        <div className="flex items-start">
          <h1 className="font-extrabold text-[48px] text-[#1A1A1A] tracking-tight leading-none drop-shadow-sm flex">
            <span>pop</span>
            <span className="text-[#FFC461]">o</span>
            <span>bob</span>
          </h1>
          <span className="text-[#1A1A1A] text-sm font-extrabold ml-1 -mt-1 opacity-80">®</span>
        </div>
        
        {/* Tagline */}
        <h2 className="font-bold text-[12px] tracking-[0.4em] text-[#1A1A1A] mt-4 opacity-80 pl-1 uppercase">
          SPECIALTY BUBBLE TEA
        </h2>

        {/* Glowing Orange Floor Shadow */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "120px" }}
          transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
          className="h-1 bg-[#FFC461] mt-6 rounded-full blur-[4px] shadow-[0_0_15px_6px_rgba(255,196,97,0.6)]"
        />

        {/* The "good times. on repeat." Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
          className="mt-6 flex flex-col items-center relative"
        >
          <p className="italic font-medium text-[#FFC461] text-[20px] leading-tight drop-shadow-sm">good times.</p>
          <div className="relative">
            <p className="italic font-medium text-[#FFC461] text-[20px] -mt-1.5 leading-tight drop-shadow-sm">on repeat.</p>
            {/* Animated Swoosh */}
            <motion.svg 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="absolute -bottom-1 left-0 w-full h-2 overflow-visible" 
              viewBox="0 0 100 10" 
              fill="none"
            >
              <path d="M5 8 Q 50 -2 95 8" stroke="#FFC461" strokeWidth="2" strokeLinecap="round" />
            </motion.svg>
          </div>
        </motion.div>

      </motion.div>

      {/* Loading Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-16 w-[240px] flex flex-col items-center z-20"
      >
        <div className="w-full h-1 bg-[#E8DCCB] rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 1.5, duration: 2.5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-[#FFC461] to-[#FF9800] rounded-full shadow-[0_0_8px_rgba(255,196,97,0.8)]"
          />
        </div>
      </motion.div>

    </div>
  );
}
