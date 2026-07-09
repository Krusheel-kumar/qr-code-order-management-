import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Mascot from '../../../components/ui/Mascot';
import { useAIContext } from './hooks/useAIContext';

export default function POPBuddyWelcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const state = location.state as { orderId?: string; customerName?: string; isGuest?: boolean } | null;

  // Extract from query params if state is not present
  const queryGuest = searchParams.get('guest');
  let isGuest = queryGuest !== null ? queryGuest === 'true' : (state?.isGuest ?? true);
  const customerName = searchParams.get('name') || state?.customerName || (isGuest ? '' : 'Friend');
  const orderId = searchParams.get('orderId') || state?.orderId || 'pob-1025';

  // Build current state to pass forward
  const currentState = {
    orderId,
    customerName,
    isGuest
  };

  const { data, loading } = useAIContext({
    orderId,
    customerName,
    isGuest
  });

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#FFF6E9] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FFB800]/20 border-t-[#FFB800] rounded-full animate-spin" />
      </div>
    );
  }

  const { customer, order } = data;
  isGuest = customer.guest;

  const handlePrimaryAction = () => {
    if (isGuest) {
      navigate('/ai/join', { state: currentState });
    } else {
      navigate('/ai/intro', { state: currentState });
    }
  };

  const handleLater = () => {
    if (isGuest) {
      navigate('/ai/maybe-later', { state: currentState });
    } else {
      navigate(`/tracking/${order.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0D4] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-[#1A0B05]">
      
      {/* Background soft bokeh circles */}
      <div className="absolute top-[10%] left-[10%] w-40 h-40 bg-white/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-60 h-60 bg-white/20 rounded-full blur-3xl pointer-events-none" />
      
      <main className="w-full max-w-sm flex-1 flex flex-col justify-between py-8 relative z-10">
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 flex flex-col justify-between items-center text-center"
            >
              {/* Top Speech Bubbles */}
              <div className="w-full flex flex-col items-center gap-4 mt-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-[20px] px-6 py-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-gray-100/30 inline-block font-bold text-[17px]"
                >
                  Hey {customer.name || 'there'}! 👋
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-[24px] px-6 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-gray-100/30 w-full max-w-[290px]"
                >
                  <p className="text-[22px] font-heading font-black text-[#1A0B05] leading-tight">
                    {isGuest
                      ? "Thanks for visiting Pop O Bob! ❤️"
                      : "Thank you for choosing us! ❤️"}
                  </p>
                </motion.div>
              </div>

              {/* Mascot in the Center */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                className="my-8 flex justify-center"
              >
                <Mascot size="lg" />
              </motion.div>

              {/* Bottom Message Bubble */}
              <div className="w-full flex flex-col gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="bg-white rounded-[24px] px-6 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-gray-100/30 w-full relative"
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100/10" />
                  <p className="text-[#4B5563] text-[15px] font-bold leading-relaxed relative z-10">
                    {isGuest ? (
                      <>
                        I have something special for you.<br/>
                        <span className="font-black text-[#1A0B05] block mt-2 mb-2">Today's order could unlock:</span>
                        <span className="flex flex-col gap-1 items-start text-[14px] max-w-[180px] mx-auto">
                          <span className="flex items-center gap-2"><span className="text-lg">🎁</span> POP Rewards</span>
                          <span className="flex items-center gap-2"><span className="text-lg">🥤</span> Secret Drinks</span>
                          <span className="flex items-center gap-2"><span className="text-lg">⭐</span> Loyalty Levels</span>
                        </span>
                      </>
                    ) : (
                      "While our team prepares your drink, I'm here to make your waiting time more fun! ✨"
                    )}
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                  className="w-full space-y-3.5"
                >
                  <button
                    onClick={handlePrimaryAction}
                    className="w-full bg-[#FFB800] text-[#1A0B05] font-black py-4.5 rounded-[20px] text-[16px] shadow-[0_8px_24px_rgba(255,184,0,0.25)] hover:bg-[#FFA500] transition-all active:scale-[0.98]"
                  >
                    {isGuest ? "Join POP Club" : "✨ Let's Explore"}
                  </button>
                  <button
                    onClick={handleLater}
                    className="w-full bg-white text-[#1A0B05] font-bold py-4.5 rounded-[20px] text-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100/50 hover:bg-gray-50 transition-all active:scale-[0.98]"
                  >
                    Maybe Later
                  </button>
                </motion.div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
