import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMascotStore } from '../store/useMascotStore';
import mascotImg from '../assets/macott.png';

export default function Mascot() {
  const { mood, isEnabled, setMood } = useMascotStore();

  // Reset to happy after celebrating
  useEffect(() => {
    if (mood === 'celebrating') {
      const timer = setTimeout(() => {
        setMood('happy');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mood, setMood]);

  if (!isEnabled) return null;

  // Using CSS background positioning to crop the specific faces from the sprite sheet
  const moodConfig = {
    happy: { bgPos: '48% 5%', bgSize: '280%', animation: { y: [0, -10, 0], scale: 1 }, text: "Hi, I'm Bobi!" },
    excited: { bgPos: '98% 5%', bgSize: '280%', animation: { y: [0, -20, 0], scale: 1.2, rotate: [0, 10, -10, 0] }, text: "Ooh, yum!" },
    thinking: { bgPos: '2% 95%', bgSize: '280%', animation: { y: 0, scale: 1, rotate: [0, 5, -5, 0] }, text: "What should we get?" },
    celebrating: { bgPos: '48% 95%', bgSize: '280%', animation: { y: [-20, 0], scale: [0.5, 1.5, 1], rotate: 360 }, text: "Yay! Order placed!" },
    sleeping: { bgPos: '98% 95%', bgSize: '280%', animation: { y: [0, 2, 0], scale: 0.9 }, text: "Zzz..." },
    hidden: { bgPos: '0% 0%', bgSize: '280%', animation: { scale: 0 }, text: "" }
  };

  const currentConfig = moodConfig[mood] || moodConfig.happy;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: 50 }}
        className="fixed bottom-6 right-6 z-[999] pointer-events-none flex flex-col items-center"
      >
        {/* Chat Bubble */}
        <AnimatePresence mode="wait">
          {mood !== 'hidden' && mood !== 'sleeping' && (
            <motion.div
              key={currentConfig.text}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white px-3 py-1.5 rounded-2xl shadow-lg border border-orange-100 text-[10px] font-bold text-orange-600 mb-2 whitespace-nowrap"
            >
              {currentConfig.text}
              {/* Little triangle for speech bubble */}
              <div className="absolute -bottom-1 right-4 w-2 h-2 bg-white border-b border-r border-orange-100 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot Body */}
        <motion.div
          animate={currentConfig.animation}
          transition={{
            repeat: mood === 'happy' || mood === 'sleeping' ? Infinity : 0,
            duration: mood === 'happy' ? 2 : 0.5,
            ease: "easeInOut"
          }}
          className="w-28 h-28 pointer-events-auto cursor-pointer drop-shadow-xl"
          onClick={() => setMood(mood === 'happy' ? 'excited' : 'happy')}
        >
          <div 
            className="w-full h-full mix-blend-multiply"
            style={{
              backgroundImage: `url(${mascotImg})`,
              backgroundSize: currentConfig.bgSize,
              backgroundPosition: currentConfig.bgPos,
              backgroundRepeat: 'no-repeat'
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
