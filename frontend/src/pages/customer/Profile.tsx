import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Award, Clock, ChevronRight, LogOut, ArrowRight, LifeBuoy } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import AuthModal from '../../components/ui/AuthModal';

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser, getLoyaltyTier } = useAuthStore();
  const { orders: guestOrders } = useOrderStore();
  
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] pb-28 flex flex-col items-center">
        {/* Guest Header Hero */}
        <div className="w-full bg-[#1A0B05] pt-16 pb-12 px-6 flex flex-col items-center text-center relative overflow-hidden rounded-b-[3rem] shadow-sm">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="w-20 h-20 bg-gradient-to-br from-[#FFFBF2] to-[#FFF0D4] rounded-full flex items-center justify-center mb-6 shadow-lg border-4 border-white/10 relative z-10">
            <UserIcon size={32} className="text-[#D4AF37]" />
          </div>
          <h2 className="font-heading font-black text-3xl text-white tracking-tight mb-3 relative z-10">
            Welcome to POP O'BOB
          </h2>
          <p className="text-sm font-medium text-white/60 max-w-xs relative z-10">
            Join the club to earn Boba Points on every order and unlock exclusive rewards.
          </p>
        </div>

        <div className="w-full max-w-[500px] px-6 -mt-6 relative z-20 space-y-6">
          <button 
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-white hover:bg-[#D4AF37] text-[#1A0B05] hover:text-white border-2 border-[#1A0B05] hover:border-[#D4AF37] font-black rounded-2xl py-4.5 text-[15px] shadow-lg shadow-[#1A0B05]/5 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 group uppercase tracking-widest"
          >
            <span>Log In / Sign Up</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          {guestOrders.length > 0 && (
            <div className="bg-white rounded-[2rem] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
              <div className="px-4 pt-4 pb-2">
                <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Guest Activity</h3>
              </div>
              <button 
                onClick={() => navigate('/order-center')}
                className="w-full bg-white rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                    <Clock size={20} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-[#1A0B05] text-sm mb-0.5">Track My Orders</h3>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{guestOrders.length} Active Order{guestOrders.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-[#1A0B05] transition-colors" />
              </button>
            </div>
          )}
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  const tier = getLoyaltyTier();

  return (
    <div className="min-h-screen bg-[#FDFCF9] pb-28 flex flex-col items-center">
      {/* Profile Header */}
      <div className="w-full px-6 pt-12 pb-8 flex flex-col items-center text-center max-w-[600px]">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1A0B05] to-[#2D1810] flex items-center justify-center text-[#D4AF37] font-black text-4xl shadow-xl border-4 border-white mb-4">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <h2 className="font-heading font-black text-2xl text-[#1A0B05] tracking-tight">{user?.username || 'Guest User'}</h2>
        <p className="text-gray-500 text-sm font-bold mt-1 bg-gray-100 px-3 py-1 rounded-full">{user?.username ? 'Verified Member' : 'Guest'}</p>
      </div>

      <div className="w-full max-w-[600px] px-6 space-y-6">
        {/* Loyalty Card */}
        <div 
          onClick={() => navigate('/ai/home', { state: { customerName: user?.username || null, isGuest: false } })}
          className="w-full rounded-[2rem] p-7 text-white bg-gradient-to-br from-[#1A0B05] via-[#2A170F] to-[#1A0B05] shadow-[0_20px_40px_rgba(26,11,5,0.2)] relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform z-20 group"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#D4AF37]/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#D4AF37]/30 transition-colors" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Status</p>
                <h4 className="font-heading font-black text-2xl drop-shadow-sm text-white">{tier?.name || 'Bronze Boba'}</h4>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#D4AF37] shadow-inner">
                <Award size={24} />
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Boba Points Balance</p>
                <h4 className="font-black text-5xl text-white drop-shadow-md leading-none">{user?.loyaltyPoints || 0}</h4>
              </div>
            </div>

            {/* Progress Bar */}
            {tier && tier.progress < 100 && (
              <div className="mt-6 bg-black/20 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between text-[10px] font-bold mb-2 text-white/70 uppercase tracking-wider">
                  <span>{user?.loyaltyPoints || 0} PTS</span>
                  <span>{tier.nextTier} PTS TO UPGRADE</span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3D77A] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)] relative" style={{ width: `${tier.progress}%` }}>
                    <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menu List */}
        <div className="bg-white rounded-[2rem] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
          <button 
            onClick={() => navigate('/order-center')}
            className="w-full bg-white rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                <Clock size={20} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-[#1A0B05] text-sm mb-0.5">Order History</h3>
                <p className="text-xs text-gray-400 font-medium">Track active & past orders</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#1A0B05] transition-colors" />
          </button>

          <div className="h-[1px] bg-gray-100 mx-4 my-1"></div>

          <button 
            className="w-full bg-white rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
                <LifeBuoy size={20} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-[#1A0B05] text-sm mb-0.5">Help & Support</h3>
                <p className="text-xs text-gray-400 font-medium">Get assistance with orders</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#1A0B05] transition-colors" />
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 border-2 border-transparent hover:border-red-100 text-red-500 hover:bg-red-50 font-black rounded-2xl transition-all active:scale-[0.98] mt-6 shadow-sm"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
}
