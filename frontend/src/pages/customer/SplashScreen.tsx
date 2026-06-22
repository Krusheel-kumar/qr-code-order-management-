import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Total animation is 3.0s, hold for 1.2s before routing
    const timer = setTimeout(() => {
      navigate('/home');
    }, 4200);
    return () => clearTimeout(timer);
  }, [navigate]);

  const getDelayForDot = (index: number) => {
    switch (index) {
      case 4: return 0.1;
      case 1:
      case 7: return 0.5;
      case 0:
      case 2: return 1.1;
      case 3:
      case 5:
      case 6:
      case 8: return 1.7;
      default: return 0;
    }
  };

  const getDotContent = (index: number) => {
    if (index === 0 || index === 2) {
      return <div className="absolute -bottom-1 -right-1 w-[65%] h-[65%] bg-white rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]" />;
    }
    if (index === 6 || index === 8) {
      return <div className="absolute -top-1 -right-1 w-[65%] h-[65%] bg-white rounded-full shadow-[inset_1px_-1px_2px_rgba(0,0,0,0.1)]" />;
    }
    return null;
  };

  const getDotStyle = (index: number) => {
    const isWhite = index === 3 || index === 5;
    return isWhite 
      ? 'bg-white shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05)]' 
      : 'bg-gradient-to-br from-[#FFC107] to-[#FF8F00] shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.15)]'; 
  };

  return (
    <div className="min-h-[100dvh] bg-[#FFFBF2] flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-transparent">
      
      {/* Ambient Premium Lighting & Texture */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FFD54F] opacity-[0.03] blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FF8F00] opacity-[0.03] blur-[100px] rounded-full" />
      </div>

      {/* Floating Boba Pearls Background */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: "-20vh", opacity: [0, 0.15, 0] }}
          transition={{
            duration: 8 + Math.random() * 5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "linear"
          }}
          className="absolute rounded-full bg-[#1A0B05] blur-[1px] z-0"
          style={{
            width: `${Math.random() * 20 + 15}px`,
            height: `${Math.random() * 20 + 15}px`,
            left: `${Math.random() * 80 + 10}%`,
          }}
        />
      ))}

      <div className="relative flex flex-col items-center justify-center z-10 scale-[1.05]">
        
        {/* Stage 05: Circle Reveal (CSS) */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: [1, 1, 0] }}
          transition={{ 
            delay: 2.2, 
            duration: 0.8, 
            times: [0, 0.5, 1],
            ease: "easeInOut"
          }}
          className="absolute w-[180px] h-[180px] bg-[#111] rounded-full z-0 shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
        />

        {/* 3x3 Dot Grid (CSS Animation) */}
        <motion.div 
          animate={{ opacity: [1, 1, 0], scale: [1, 1, 0.95] }}
          transition={{ delay: 2.6, duration: 0.4 }}
          className="grid grid-cols-3 gap-2.5 relative z-10 p-6"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: getDelayForDot(i),
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1] 
              }}
              className={`w-[32px] h-[32px] rounded-full ${getDotStyle(i)} relative overflow-hidden`}
            >
              {getDotContent(i)}
            </motion.div>
          ))}
        </motion.div>

        {/* Ripple Shockwave */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.8, opacity: [0, 0.8, 0] }}
          transition={{ delay: 2.6, duration: 1.2, ease: "easeOut" }}
          className="absolute w-[140px] h-[140px] rounded-full border-[3px] border-[#FFB300] z-10"
        />
        
        {/* Second Ripple */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 2.2, opacity: [0, 0.4, 0] }}
          transition={{ delay: 2.75, duration: 1.5, ease: "easeOut" }}
          className="absolute w-[140px] h-[140px] rounded-full border-[2px] border-[#FFD54F] z-10"
        />

        {/* The EXACT Official Logo Image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              y: [0, -6, 0] // Continuous floating up and down
            }}
            transition={{ 
              opacity: { delay: 2.6, duration: 0.4 },
              scale: { delay: 2.6, duration: 0.6, type: "spring", stiffness: 200, damping: 12 },
              rotate: { delay: 2.6, duration: 0.6, type: "spring", stiffness: 200, damping: 12 },
              y: { delay: 3.2, duration: 3, repeat: Infinity, ease: "easeInOut" } // Floats endlessly after landing
            }}
            className="w-[140px] h-[140px] rounded-full overflow-hidden flex items-center justify-center drop-shadow-[0_16px_32px_rgba(255,179,0,0.25)]"
          >
            <img src="/assets/logo 2.png" alt="Exact Logo" className="w-[125%] h-[125%] object-cover" />
          </motion.div>
        </div>

        {/* Stage 06: Brand Lockup Text (CSS version fades out, wait, logoImg has no text?) */}
        {/* We keep the CSS text but make it extremely premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.6, ease: "easeOut" }}
          className="absolute top-[100%] mt-4 w-full flex flex-col items-center whitespace-nowrap"
        >
          <h1 className="font-heading font-black text-[42px] tracking-tighter lowercase flex items-center leading-none text-[#1A0B05] drop-shadow-sm">
            popobob<span className="text-[12px] font-extrabold ml-1 -mt-5 text-[#FFB300]">&reg;</span>
          </h1>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#8D6E63] mt-2 opacity-80">Specialty Bubble Tea</span>
        </motion.div>
        
      </div>
      
    </div>
  );
}
