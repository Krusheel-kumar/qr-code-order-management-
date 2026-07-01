import { useState, useEffect } from 'react';

import { LogOut, Clock, Award, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { getUserOrders, loginUser, registerUser } from '../../api';

export default function Profile() {
  const { user, setUser, getLoyaltyTier } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // Auth State
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setLoadingOrders(true);
      getUserOrders(user.id).then(data => {
        setOrders(data);
        setLoadingOrders(false);
      });
    }
  }, [user]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAuth(true);
    setError('');

    try {
      if (isLogin) {
        const u = await loginUser({ email, password });
        setUser(u);
      } else {
        const u = await registerUser({ name, email, password, phoneNumber });
        setUser(u);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFFBF2] p-6 pb-28 pt-12 flex flex-col">
        <h2 className="font-heading font-black text-3xl text-gray-900 mb-2">
          {isLogin ? 'Welcome Back' : "Join POP O'BOB®"}
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          {isLogin ? 'Log in to earn points and reorder favorites.' : 'Sign up to earn Boba points on every order!'}
        </p>

        {error && <div className="mb-4 text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>}

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
                    className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FFB300] outline-none text-sm font-medium"
                  />
                </div>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    placeholder="Mobile Number (Optional)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FFB300] outline-none text-sm font-medium"
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
              className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FFB300] outline-none text-sm font-medium"
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
              className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FFB300] outline-none text-sm font-medium"
            />
          </div>

          <button 
            disabled={loadingAuth}
            type="submit" 
            className="mt-2 w-full bg-[#1A0B05] text-white font-extrabold rounded-full py-4 text-[15px] shadow-[0_8px_20px_rgba(26,11,5,0.2)] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loadingAuth ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <span className="text-sm text-gray-500 font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-[#FF8F00] font-extrabold ml-1">
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </span>
        </div>
      </div>
    );
  }

  const tier = getLoyaltyTier();

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-6 pt-12 pb-28">
      <h2 className="font-heading font-black text-3xl text-gray-900 mb-6">Your Account</h2>

      {/* Loyalty Card */}
      <div className={`w-full rounded-[1.5rem] p-5 text-white mb-8 bg-gradient-to-br ${tier?.color || 'from-[#CD7F32] to-[#B87333]'} shadow-lg relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg mb-0.5">{user?.username || 'Guest'}</h3>
              <p className="text-xs font-medium opacity-80">{user?.email || ''}</p>
            </div>
            <Award size={32} className="opacity-80" />
          </div>
          
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-1">Tier Status</p>
              <h4 className="font-heading font-black text-2xl drop-shadow-sm">{tier?.name || 'Bronze Boba'}</h4>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-1">Boba Points</p>
              <h4 className="font-black text-3xl">{user?.loyaltyPoints || 0}</h4>
            </div>
          </div>

          {/* Progress Bar */}
          {tier && tier.progress < 100 && (
            <div className="mt-4">
              <div className="flex justify-between text-[10px] font-bold mb-1 opacity-80">
                <span>{user?.loyaltyPoints || 0} pts</span>
                <span>{tier.nextTier} pts to Next Tier</span>
              </div>
              <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${tier.progress}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order History */}
      <h3 className="font-extrabold text-lg text-gray-900 mb-4 flex items-center gap-2">
        <Clock size={18} /> Past Orders
      </h3>

      {loadingOrders ? (
        <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-[#FFB300] border-t-transparent rounded-full animate-spin"></div></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm">
          <span className="text-3xl mb-2 block">🧋</span>
          <p className="text-sm font-bold text-gray-500">No orders yet.</p>
          <p className="text-xs text-gray-400 mt-1">Your boba journey begins today!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-8">
          {orders?.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-[1.2rem] border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-gray-400">Order #{order?.id?.split('-')[0].toUpperCase() || 'NEW'}</span>
                <span className="text-xs font-extrabold text-[#FF8F00] bg-[#FFF5E5] px-2 py-0.5 rounded-full">{order.status}</span>
              </div>
              <p className="text-[11px] text-gray-400 mb-3">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'} at {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </p>
              
              <div className="flex flex-col gap-1 mb-3">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="font-bold text-gray-800">{item.quantity}x {item.productName}</span>
                    <span className="font-bold">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
                <span className="font-bold text-sm">Total</span>
                <span className="font-black text-lg">₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors shadow-sm"
      >
        <LogOut size={18} /> Log Out
      </button>
    </div>
  );
}
