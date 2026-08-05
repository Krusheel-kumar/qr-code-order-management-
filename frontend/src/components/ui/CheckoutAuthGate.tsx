import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, UserCircle2, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

interface CheckoutAuthGateProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onGuestSubmit: (name: string, phone: string) => void;
  subtotal: number;
}

export default function CheckoutAuthGate({ isOpen, onClose, onLoginClick, onGuestSubmit, subtotal }: CheckoutAuthGateProps) {
  const [isGuestForm, setIsGuestForm] = useState(false);
  const cartStore = useCartStore();
  
  // Pre-fill if already in cart
  const [name, setName] = useState(cartStore.customerName || '');
  const [phone, setPhone] = useState(cartStore.customerPhone || '');
  const [error, setError] = useState('');

  // Calculate potential points (1 point per ₹10 spent)
  const potentialPoints = Math.floor(subtotal / 10);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsGuestForm(false);
      setError('');
    }
  }, [isOpen]);

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Please enter a valid name');
      return;
    }
    if (cartStore.orderType !== 'DINE_IN' && phone.trim().length < 10) {
      setError('Please enter a valid mobile number for order updates');
      return;
    }
    setError('');
    onGuestSubmit(name, phone);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1A0B05]/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ y: "100%", opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full sm:max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 pb-2 relative z-20">
            <h3 className="font-heading font-black text-2xl text-[#1A0B05] tracking-tight">
              {!isGuestForm ? 'Almost there!' : 'Guest Details'}
            </h3>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 pt-2 pb-8 overflow-y-auto custom-scrollbar">
            {!isGuestForm ? (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Value Proposition Box */}
                <div className="bg-gradient-to-br from-[#FFFDF8] to-[#FFFBF2] rounded-[2rem] p-6 border border-[#D4AF37]/30 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                  
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FFC461] flex items-center justify-center text-white shrink-0 shadow-md">
                      <Sparkles size={24} className="fill-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-[#1A0B05] leading-tight mb-1">
                        Unlock Your Rewards
                      </h4>
                      <p className="text-sm font-semibold text-gray-600 mb-3">
                        Log in now to earn <span className="text-[#D4AF37] font-black">{potentialPoints} Boba Points</span> on this order.
                      </p>
                      <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D4AF37]/20 text-[11px] font-bold text-gray-500 uppercase tracking-widest shadow-sm">
                        <ShieldCheck size={14} className="text-emerald-500" /> Secure 1-Tap Login
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <button 
                    onClick={onLoginClick}
                    className="w-full bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <UserCircle2 size={20} />
                    <span>Join Rewards / Sign In</span>
                  </button>
                  
                  <button 
                    onClick={() => setIsGuestForm(true)}
                    className="w-full bg-white text-gray-400 hover:text-gray-600 border border-gray-200 hover:border-gray-300 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex flex-col items-center justify-center gap-0.5"
                  >
                    <span>Continue as Guest</span>
                    <span className="text-[9px] font-bold text-red-400/80 tracking-normal lowercase">(lose {potentialPoints} points)</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <p className="text-sm font-semibold text-gray-500">
                  Please provide your details so we know who to give this delicious boba to!
                </p>

                <form onSubmit={handleGuestSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-semibold text-sm"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Mobile Number {cartStore.orderType === 'DINE_IN' ? '(Optional)' : '*'}</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-semibold text-sm"
                    />
                    <p className="text-[10px] font-semibold text-gray-400 mt-1.5 px-1">
                      We'll use this to send you order tracking updates.
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold text-center border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="pt-4 space-y-3">
                    <button 
                      type="submit"
                      className="w-full bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                    >
                      Proceed to Payment ➔
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => setIsGuestForm(false)}
                      className="w-full bg-transparent text-gray-400 hover:text-gray-600 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
                    >
                      Back
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
