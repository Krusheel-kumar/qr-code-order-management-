import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ArrowRight, Gift } from 'lucide-react';
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
      <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-0 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="w-full sm:max-w-[440px] bg-[var(--color-surface)] rounded-t-[var(--radius-modal)] sm:rounded-[var(--radius-modal)] overflow-hidden shadow-[var(--shadow-soft-modal)] relative z-10 max-h-[90vh] flex flex-col pb-safe"
        >
          {/* Drag Handle (Mobile) */}
          <div className="w-full flex justify-center pt-4 pb-2 sm:hidden">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-800 transition-colors z-10"
          >
            <X size={16} />
          </button>

          <div className="p-8 pt-4 overflow-y-auto custom-scrollbar">
            {!isGuestForm ? (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Header Text */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FFFBF2] to-[#FFF0D4] rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm border border-[#D4AF37]/20 mx-auto mb-4 relative">
                    <Gift size={28} />
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md animate-pulse">
                      +{potentialPoints}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-[#1A0B05] tracking-tight leading-tight mb-2">
                    Wait, Claim Your Points!
                  </h3>
                  <p className="text-sm font-medium text-gray-500 px-4">
                    You can earn <span className="bg-[#FFF8E7] text-[#B8860B] font-black px-2 py-0.5 rounded-md border border-[#D4AF37]/30 inline-block transform -rotate-1">{potentialPoints} Boba Points</span> on this order.
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <button 
                    onClick={onLoginClick}
                    className="w-full bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] border-2 border-[#1A0B05] hover:border-[#D4AF37] py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm group"
                  >
                    <User size={18} className="group-hover:scale-110 transition-transform" />
                    <span>Sign Up / Log In</span>
                  </button>
                  
                  <button 
                    onClick={() => setIsGuestForm(true)}
                    className="w-full bg-white text-gray-500 hover:text-[#1A0B05] border-2 border-gray-200 hover:border-gray-300 py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all active:scale-[0.98] flex flex-col items-center justify-center gap-1 shadow-sm"
                  >
                    <span>Checkout as Guest</span>
                    <span className="text-[9px] font-bold text-red-400 tracking-normal capitalize">You will forfeit {potentialPoints} points</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col h-full"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black text-[#1A0B05] tracking-tight leading-tight mb-2">
                    Guest Details
                  </h3>
                  <p className="text-sm font-medium text-gray-500">
                    Who should we make this order for?
                  </p>
                </div>

                <form onSubmit={handleGuestSubmit} className="space-y-4">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[var(--color-surface-muted)] border border-gray-100 rounded-[var(--radius-lg)] px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] focus:bg-white text-base font-bold text-[var(--color-foreground)] placeholder:text-gray-400 placeholder:font-medium transition-all shadow-[var(--shadow-soft-sm)]"
                      autoFocus
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 pr-3 transition-colors group-focus-within:border-gray-900">
                      <span className="text-gray-800 font-bold text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      placeholder={`Mobile Number ${cartStore.orderType === 'DINE_IN' ? '(Optional)' : ''}`}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                      className="w-full bg-[var(--color-surface-muted)] border border-gray-100 rounded-[var(--radius-lg)] pl-20 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] focus:bg-white text-base font-bold text-[var(--color-foreground)] placeholder:text-gray-400 placeholder:font-medium transition-all shadow-[var(--shadow-soft-sm)]"
                    />
                  </div>
                  {cartStore.orderType !== 'DINE_IN' && (
                    <p className="text-[11px] font-bold text-gray-400 mt-1 px-1 text-center">
                      We'll use this to send you order tracking updates.
                    </p>
                  )}

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl text-xs font-bold text-center border border-red-100">
                          {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-4 space-y-3">
                    <button 
                      type="submit"
                      className="w-full bg-[var(--color-premium-dark)] text-white hover:bg-[#D4AF37] hover:text-[#1A0B05] py-4 rounded-[var(--radius-md)] font-black text-sm uppercase tracking-widest shadow-[var(--shadow-soft-1)] hover:shadow-[var(--shadow-soft-2)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight size={16} />
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => setIsGuestForm(false)}
                      className="w-full text-gray-400 hover:text-[#1A0B05] py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-colors"
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
