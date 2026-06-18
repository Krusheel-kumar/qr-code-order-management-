import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FloatingAIButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/quiz') {
    return null;
  }

  return (
    <div className="fixed bottom-[115px] right-4 z-[9000] flex flex-col items-center justify-center pointer-events-none">
      
      {/* Pulse Aura Background */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute top-0 bg-[#FFD54F]/30 rounded-full blur-xl pointer-events-none"
        style={{ width: '65px', height: '65px' }}
      />

      <motion.button
        onClick={() => navigate('/quiz')}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto relative flex flex-col items-center justify-center group"
      >
        {/* Container forcing a perfect circle */}
        <div className="relative z-10 w-[70px] h-[70px] rounded-full overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.25)] border-[3px] border-white bg-white">
          <img 
            src="/assets/logo 2.png" 
            alt="POB AI" 
            className="w-full h-full object-cover scale-[1.05]" 
          />
        </div>
        
        {/* Glowing Notification Dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white z-20 shadow-md" />
      </motion.button>
      
      {/* Sleek Floating Glass Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-1 bg-white/95 backdrop-blur-xl border border-black/5 px-3 py-1 rounded-full text-black text-[10px] font-extrabold tracking-[0.1em] shadow-lg flex items-center gap-1.5 pointer-events-auto cursor-pointer"
        onClick={() => navigate('/quiz')}
      >
        <div className="w-1.5 h-1.5 bg-[#FFD54F] rounded-full animate-pulse shadow-sm" />
        POB Ai
      </motion.div>
    </div>
  );
}
