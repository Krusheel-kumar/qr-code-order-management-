import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';

import { placeOrder, getUserProfile } from '../../api';

const STEPS = [
  { id: 'payment', label: 'Payment Received' },
  { id: 'order', label: 'Creating Your Order' },
  { id: 'rewards', label: 'Updating Boba Wallet' },
  { id: 'kitchen', label: 'Notifying the Kitchen' }
];

export default function ProcessingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartStore = useCartStore();
  const { user, setUser } = useAuthStore();
  const { addOrder } = useOrderStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [earnedPoints, setEarnedPoints] = useState(0);
  
  const hasProcessed = useRef(false);

  useEffect(() => {
    // If user accesses this page directly without payload, send to home
    if (!location.state?.orderPayload) {
      navigate('/home', { replace: true });
      return;
    }

    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const { orderPayload, cartTotal } = location.state;

    const processOrder = async () => {
      try {
        // Step 1: Payment Received (Immediate)
        setCurrentStep(1);
        
        // Wait a tiny bit for UI to settle
        await new Promise(r => setTimeout(r, 600));
        
        // Step 2: Creating Order (API Call)
        const result = await placeOrder(orderPayload);
        setCurrentStep(2);
        
        // Clear cart in background safely now that order is created
        cartStore.clearCart();
        addOrder(result.id);
        
        // Calculate estimated earned points
        const earned = Math.floor((cartTotal || 0) * 0.10);
        setEarnedPoints(earned);

        // Step 3: Updating Rewards
        if (user) {
          try {
             const updatedUser = await getUserProfile(user.id);
             if (updatedUser) setUser(updatedUser);
          } catch (e) {}
        }
        await new Promise(r => setTimeout(r, 600));
        setCurrentStep(3);
        
        // Step 4: Notifying Kitchen
        await new Promise(r => setTimeout(r, 600));
        setCurrentStep(4);
        
        // Final Success
        await new Promise(r => setTimeout(r, 400));
        setIsSuccess(true);
        
        // Wait for celebration animation then navigate to tracking
        setTimeout(() => {
          navigate(`/tracking/${result.id}`, { replace: true });
        }, 3000);
        
      } catch (err: any) {
        console.error("Failed to place order:", err);
        setError("Payment received, but order creation was delayed. Don't worry, our team is on it!");
      }
    };

    processOrder();
  }, [location.state, navigate, cartStore, addOrder, user, setUser]);

  return (
    <div className="min-h-[100dvh] bg-[#FDFCF8] font-sans flex flex-col items-center justify-center p-6 text-[#1A0B05] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,rgba(253,252,248,0)_70%)] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isSuccess && !error ? (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm flex flex-col items-center relative z-10"
          >
            {/* Spinning Loader */}
            <div className="relative w-24 h-24 mb-10">
              <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-[#D4AF37] border-t-transparent rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center text-3xl">🧋</div>
            </div>

            <h2 className="font-heading font-black text-2xl mb-8 tracking-tight">Processing Order...</h2>

            <div className="w-full space-y-4">
              {STEPS.map((step, index) => {
                const isCompleted = currentStep > index;
                const isCurrent = currentStep === index;
                const isPending = currentStep < index;

                return (
                  <motion.div 
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center relative">
                      {isCompleted ? (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white shadow-md shadow-green-500/20"
                        >
                          <CheckCircle2 size={18} strokeWidth={3} />
                        </motion.div>
                      ) : isCurrent ? (
                        <div className="w-full h-full bg-[#FFFBF2] border border-[#D4AF37]/30 rounded-full flex items-center justify-center text-[#D4AF37]">
                          <Loader2 size={16} className="animate-spin" />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-300 rounded-full" />
                        </div>
                      )}
                    </div>
                    <span className={`font-bold text-[15px] ${isCompleted ? 'text-[#1A0B05]' : isCurrent ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm flex flex-col items-center text-center relative z-10"
          >
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-500/10">
              <AlertCircle size={40} strokeWidth={2} />
            </div>
            <h2 className="font-heading font-black text-2xl mb-3">Order Delayed</h2>
            <p className="text-gray-600 font-medium mb-8 leading-relaxed">
              {error}
            </p>
            <button 
              onClick={() => window.location.href = 'tel:+919999999999'}
              className="bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
            >
              Contact Support
            </button>
            <button 
              onClick={() => navigate('/home')}
              className="mt-4 font-bold text-gray-500"
            >
              Back to Home
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm flex flex-col items-center text-center relative z-10"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-24 h-24 bg-green-500 text-white rounded-[32px] flex items-center justify-center mb-8 shadow-xl shadow-green-500/20 rotate-3"
            >
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </motion.div>
            
            <h2 className="font-heading font-extrabold text-[32px] leading-none mb-4 tracking-tight text-[#1A0B05]">
              Payment Successful!
            </h2>
            
            {user && earnedPoints > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 bg-[#FFFBF2] border border-[#D4AF37]/30 px-5 py-2.5 rounded-full mt-4"
              >
                <Sparkles size={16} className="text-[#D4AF37]" />
                <span className="font-bold text-[#D4AF37]">+{earnedPoints} Boba Points Earned</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
