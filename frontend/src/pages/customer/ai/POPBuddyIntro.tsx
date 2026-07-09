import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import Mascot from '../../../components/ui/Mascot';
import AnimatedBackground from '../../../components/ui/AnimatedBackground';
import { useAIContext } from './hooks/useAIContext';

export default function POPBuddyIntro() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { orderId?: string; customerName?: string; isGuest?: boolean } | null;

  const { data, loading } = useAIContext({
    orderId: state?.orderId,
    customerName: state?.customerName,
    isGuest: state?.isGuest
  });

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FFB800]/20 border-t-[#FFB800] rounded-full animate-spin" />
      </div>
    );
  }

  const { customer, order } = data;

  const handleNext = () => {
    navigate('/ai/home', { state });
  };

  const handleSkip = () => {
    navigate(`/tracking/${order?.id || state?.orderId || ''}`);
  };

  const features = [
    { icon: '❤️', text: "Discover drinks you'll love" },
    { icon: '🎁', text: 'Unlock rewards & offers' },
    { icon: '🛍️', text: 'Get personalized recommendations' },
    { icon: '⭐', text: 'Earn POP Points' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.6 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  } as const;


  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col relative overflow-hidden font-sans">
      <AnimatedBackground />

      <header className="flex justify-between items-center px-6 py-5 sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <ChevronLeft size={28} strokeWidth={2.5} className="text-[#1A0B05]" />
        </button>
        <h1 className="font-heading font-extrabold text-[17px] tracking-tight">
          POB AI
        </h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 flex flex-col px-5 relative z-10">
        <AnimatePresence>
          {showContent && (
            <div className="flex-1 flex flex-col items-center">
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                className="mt-4 mb-6"
              >
                <Mascot size="lg" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                className="bg-white rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 w-full mb-8 relative flex-1"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-l border-t border-gray-100/50" />
                
                <h2 className="text-[22px] font-heading font-extrabold text-[#1A0B05] mb-1">
                  Hi {customer.name} 👋
                </h2>
                <h3 className="text-xl font-heading font-bold text-[#1A0B05] mb-3">
                  Welcome to POB AI!
                </h3>
                <p className="text-gray-500 text-[15px] font-medium mb-6">
                  I'm your personal bubble tea companion.
                </p>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-4 mb-8"
                >
                  {features.map((feature, i) => (
                    <motion.div key={i} variants={itemVariants} className="flex items-center gap-4">
                      <div className="text-xl">{feature.icon}</div>
                      <span className="font-bold text-[15px] text-[#1A0B05]">{feature.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
                
                <p className="text-center font-bold text-[#1A0B05] mb-6">
                  Shall we make your wait awesome? 😎
                </p>

                <div className="space-y-3 mt-auto">
                  <button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-[#7E57C2] to-[#5E35B1] text-white font-bold py-4 rounded-full text-[17px] shadow-[0_8px_32px_rgba(126,87,194,0.3)] active:scale-[0.98] transition-transform"
                  >
                    Let's Go! 🚀
                  </button>
                  <button
                    onClick={handleSkip}
                    className="w-full bg-transparent text-gray-500 font-bold py-4 rounded-full active:scale-[0.98] transition-transform hover:bg-black/5"
                  >
                    Not Now
                  </button>
                </div>
              </motion.div>

            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
