import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Mascot from '../../../components/ui/Mascot';
import AnimatedBackground from '../../../components/ui/AnimatedBackground';
import { ArrowRight, ChevronLeft } from 'lucide-react';

export default function POPBuddyMaybeLater() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { orderId?: string; customerName?: string; isGuest?: boolean } | null;

  const handleStartExploring = () => {
    navigate('/ai/home', { state });
  };

  const handleBackToTracking = () => {
    navigate(`/tracking/${state?.orderId || ''}`);
  };

  return (
    <div className="min-h-screen bg-[#F9F7FF] flex flex-col relative overflow-hidden font-sans text-[#1A0B05]">
      <AnimatedBackground />

      <header className="flex justify-between items-center px-6 py-5 relative z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <ChevronLeft size={28} strokeWidth={2.5} className="text-[#1A0B05]" />
        </button>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 flex flex-col px-5 relative z-10">
        <div className="flex-1 flex flex-col items-center justify-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="mb-8"
          >
            <Mascot size="lg" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 text-center w-full max-w-sm"
          >
            <h2 className="text-[26px] font-heading font-extrabold text-[#1A0B05] mb-3">
              No worries! 😊
            </h2>
            <p className="text-[15px] text-gray-500 font-medium mb-6 leading-relaxed">
              You can always join later.<br />
              It'll still help you discover our drinks & surprises.
            </p>

            <div className="bg-[#FDFCF8] rounded-2xl p-4 border border-gray-100 mb-6 flex items-center justify-center gap-2">
              <span className="text-gray-600 font-bold text-sm">
                Enjoy exploring with POB AI! ✨
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleStartExploring}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7E57C2] to-[#5E35B1] text-white font-bold py-4 rounded-full text-[17px] shadow-[0_8px_32px_rgba(126,87,194,0.3)] active:scale-[0.98] transition-transform"
              >
                Start Exploring
              </button>

              <button
                onClick={handleBackToTracking}
                className="w-full flex items-center justify-center gap-2 bg-transparent border-2 border-gray-100 text-gray-600 font-bold py-4 rounded-full text-[15px] active:scale-[0.98] transition-transform hover:bg-gray-50"
              >
                Continue to Tracking
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
