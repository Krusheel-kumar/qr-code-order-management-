import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, LogOut, Clock, Award, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface ProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSheet({ isOpen, onClose }: ProfileSheetProps) {
  const navigate = useNavigate();
  const { user, setUser, getLoyaltyTier } = useAuthStore();

  if (!user) return null;

  const tier = getLoyaltyTier();

  const handleLogout = () => {
    setUser(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          <motion.div
            initial={{ y: '100%', x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: '100%', x: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 md:inset-auto md:right-0 md:top-0 h-[90vh] md:h-full md:w-[420px] bg-[#FDFCF9] rounded-t-[2.5rem] md:rounded-none z-[101] flex flex-col overflow-y-auto shadow-2xl pt-12 px-6 pb-12"
          >
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors z-50"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1A0B05] font-black text-xl shadow-lg border-2 border-[#1A0B05]">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="font-heading font-black text-2xl text-[#1A0B05] tracking-tight">{user?.username || 'Guest'}</h2>
                <p className="text-gray-500 text-sm font-medium">{user?.email || 'user@example.com'}</p>
              </div>
            </div>

            {/* Loyalty Card */}
            <div 
              onClick={() => {
                onClose();
                navigate('/ai/home', {
                  state: {
                    customerName: user?.username || null,
                    isGuest: !user
                  }
                });
              }}
              className="w-full rounded-[2rem] p-6 text-white mb-10 bg-gradient-to-br from-[#1A0B05] to-[#2D1810] border border-[#D4AF37]/30 shadow-[0_8px_30px_rgba(26,11,5,0.15)] relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform z-20 group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#D4AF37]/20 transition-colors" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Tier Status</p>
                    <h4 className="font-heading font-black text-2xl drop-shadow-sm text-white">{tier?.name || 'Bronze Boba'}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                    <Award size={22} />
                  </div>
                </div>
                
                <div className="flex justify-between items-end mb-3">
                  <div className="flex flex-col">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Boba Points</p>
                    <h4 className="font-black text-4xl text-[#D4AF37] leading-none">{user?.loyaltyPoints || 0}</h4>
                  </div>
                </div>

                {/* Progress Bar */}
                {tier && tier.progress < 100 && (
                  <div className="mt-5">
                    <div className="flex justify-between text-[10px] font-bold mb-2 text-white/60">
                      <span>{user?.loyaltyPoints || 0} pts</span>
                      <span>{tier.nextTier} pts to Next Tier</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#D4AF37] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" style={{ width: `${tier.progress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* My Orders Button */}
            <button 
              onClick={() => {
                onClose();
                navigate('/order-center');
              }}
              className="w-full bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:border-[#D4AF37]/50 hover:shadow-md transition-all mb-10 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FFFBF2] rounded-2xl flex items-center justify-center text-[#D4AF37]">
                  <Clock size={24} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <h3 className="font-heading font-black text-lg text-[#1A0B05] mb-0.5">My Orders</h3>
                  <p className="text-xs text-gray-500 font-medium">Track active orders & view history</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-gray-300 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
            </button>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-[#1A0B05] text-[#1A0B05] hover:bg-[#1A0B05] hover:text-white font-black rounded-full transition-all active:scale-[0.98]"
            >
              <LogOut size={18} /> Sign Out
            </button>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
