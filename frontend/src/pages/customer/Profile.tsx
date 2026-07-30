import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Clock, Award, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { loginUser, registerUser } from '../../api';

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser, getLoyaltyTier } = useAuthStore();
  const { orders: guestOrders } = useOrderStore();
  
  // Auth State
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [error, setError] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAuth(true);
    setError('');

    try {
      if (isLogin) {
        const response = await loginUser({ email, password });
        setUser(response.user);
      } else {
        const response = await registerUser({ name, email, password, phoneNumber });
        setUser(response.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] p-6 pb-28 pt-12 flex flex-col justify-center max-w-[500px] mx-auto">
        <div className="mb-10 text-center">
          <img src="/assets/horizontal_logo.png" alt="POP O'BOB Logo" className="h-10 w-auto mx-auto mb-6" />
          <h2 className="font-heading font-black text-3xl text-[#1A0B05] mb-2 tracking-tight">
            {isLogin ? 'Welcome Back' : "Join POP O'BOB®"}
          </h2>
          <p className="text-sm font-medium text-gray-500">
            {isLogin ? 'Log in to earn points and reorder your favorites.' : 'Sign up to earn Boba points on every order!'}
          </p>
        </div>

        {error && (
          <div className="mb-6 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-4">
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none text-sm font-semibold text-[#1A0B05] placeholder:text-gray-400 transition-all"
                  />
                </div>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    placeholder="Mobile Number (Optional)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none text-sm font-semibold text-[#1A0B05] placeholder:text-gray-400 transition-all"
                  />
                </div>
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none text-sm font-semibold text-[#1A0B05] placeholder:text-gray-400 transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none text-sm font-semibold text-[#1A0B05] placeholder:text-gray-400 transition-all"
            />
          </div>

          <button 
            disabled={loadingAuth}
            type="submit" 
            className="mt-4 w-full bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] font-black rounded-full py-4 text-[15px] shadow-lg hover:shadow-[0_8px_24px_rgba(212,175,55,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 group"
          >
            {loadingAuth ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <span>{isLogin ? 'Log In' : 'Create Account'}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <span className="text-sm text-gray-500 font-medium">
            {isLogin ? "Don't have an account? " : "Already a member? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="text-[#D4AF37] hover:text-[#1A0B05] font-black ml-1 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </span>
        </div>
        
        {guestOrders.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-center font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-4">Guest Order Tracking</h3>
            <button 
              onClick={() => navigate('/order-center')}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:border-[#D4AF37]/50 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FFFBF2] rounded-xl flex items-center justify-center text-[#D4AF37]">
                  <Clock size={20} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-[#1A0B05] text-sm mb-0.5">Track My Orders</h3>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{guestOrders.length} Order{guestOrders.length > 1 ? 's' : ''} Found</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        )}
      </div>
    );
  }

  const tier = getLoyaltyTier();

  return (
    <div className="min-h-screen bg-[#FDFCF9] px-6 pt-12 pb-28 max-w-[600px] mx-auto w-full">
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
        onClick={() => navigate('/ai/home', {
          state: {
            customerName: user?.username || null,
            isGuest: !user
          }
        })}
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
        onClick={() => navigate('/order-center')}
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
        className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-[#1A0B05] text-[#1A0B05] hover:bg-[#1A0B05] hover:text-white font-black rounded-full transition-all active:scale-[0.98] mt-6"
      >
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  );
}
