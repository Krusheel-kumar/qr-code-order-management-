import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Mascot from '../../../components/ui/Mascot';
import AnimatedBackground from '../../../components/ui/AnimatedBackground';
import { Mail, Smartphone, ChevronLeft, ShieldCheck, Zap } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import AuthModal from '../../../components/ui/AuthModal';

export default function POPBuddyJoin() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { orderId?: string; customerName?: string; isGuest?: boolean } | null;

  const { user } = useAuthStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // If user successfully logs in/registers, automatically proceed to POB AI Intro flow
  useEffect(() => {
    if (user) {
      setIsAuthOpen(false);
      navigate('/ai/intro', {
        state: {
          orderId: state?.orderId || '',
          customerName: user.username,
          isGuest: false
        }
      });
    }
  }, [user, navigate, state]);

  const handleEmailLogin = () => {
    setIsAuthOpen(true);
  };

  const handleMaybeLater = () => {
    navigate('/ai/maybe-later', { state });
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

      <main className="flex-1 flex flex-col px-5 pb-6 relative z-10 max-w-sm mx-auto w-full">
        
        <div className="flex justify-center mb-6">
          <Mascot size="sm" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 flex flex-col items-center relative overflow-hidden"
        >
          <h2 className="text-[26px] font-heading font-extrabold text-[#1A0B05] mb-1.5 text-center">
            Join POP Club
          </h2>
          <p className="text-[14px] text-gray-500 font-medium mb-8 text-center max-w-[220px] leading-relaxed">
            Unlock exclusive rewards & a better experience
          </p>

          <div className="w-full space-y-3">
            <button className="w-full relative flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-400 font-bold py-4 rounded-full opacity-60 cursor-not-allowed text-[15px]">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-bold">Soon</span>
            </button>

            <button className="w-full relative flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-400 font-bold py-4 rounded-full opacity-60 cursor-not-allowed text-[15px]">
              <Smartphone className="w-5 h-5 text-gray-400" />
              Continue with Phone
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-bold">Soon</span>
            </button>

            <button className="w-full relative flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-400 font-bold py-4 rounded-full opacity-60 cursor-not-allowed text-[15px]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05 1.8-3.08 1.8-.95 0-1.25-.57-2.45-.57-1.2 0-1.55.55-2.45.55-1.05 0-2.12-.85-3.18-1.85C3.78 17.54 1.7 11.23 4.28 7.82c1.28-1.7 3.07-2.77 4.98-2.77 1.33 0 2.5.85 3.18.85.73 0 2.2-1.02 3.8-1.02 1.6 0 3.3.73 4.3 2.15-3.75 2.13-3.15 7.42.5 8.92-.93 2.4-2.23 4.88-4.01 4.33zM12.03 4.9c-.25-2.3 1.8-4.28 3.9-4.7.4 2.4-1.95 4.53-3.9 4.7z" />
              </svg>
              Continue with Apple
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-bold">Soon</span>
            </button>

            <button
              onClick={handleEmailLogin}
              className="w-full relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#7E57C2] to-[#5E35B1] text-white font-bold py-4 rounded-full text-[15px] shadow-[0_8px_24px_rgba(126,87,194,0.2)] active:scale-[0.98] transition-transform"
            >
              <Mail className="w-5 h-5" />
              Continue with Email
            </button>
          </div>

          <div className="w-full h-px bg-gray-100 my-6" />

          <div className="flex flex-col items-center gap-2.5 text-[12px] text-gray-400 font-semibold">
            <span className="flex items-center gap-2"><Zap size={14} className="text-[#7E57C2]" /> It takes less than 10 seconds!</span>
            <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /> Your data is safe with us.</span>
          </div>
        </motion.div>

        <div className="mt-6 text-center">
          <button
            onClick={handleMaybeLater}
            className="text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors py-2 px-4 rounded-full hover:bg-black/5"
          >
            Maybe Later
          </button>
        </div>
      </main>

      {/* Integrate the actual AuthModal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
