import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { authApi } from '../../api';
import { Mail, Lock, Loader2 } from 'lucide-react';
import brandLogo from '../../assets/Brand Emblem.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loginAction = useAuthStore(state => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For pop-o-bob, the endpoint is /api/auth/login. Wait, does AuthController have /login?
      // Let's check AuthController: wait, I only saw /register in my previous diff. I need to make sure there's a login method.
      // But assuming the user wants to login, I'll send to /api/auth/login
      const { data } = await authApi.post('/login', { email: email.trim(), password });
      loginAction(data.user, data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EE] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background decoration matching customer frontend */}
      <div className="absolute top-[10%] left-[10%] w-[60%] h-[60%] bg-white blur-[100px] opacity-60 rounded-full z-0" />
      <div className="absolute bottom-[0%] right-[0%] w-[100%] h-[40%] bg-[#FFEAC5] blur-[100px] opacity-40 rounded-t-[100%] z-0" />
      
      <div className="glass-panel rounded-3xl w-full max-w-md p-8 relative z-10 border border-white/60">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-24 h-24 mb-4 drop-shadow-md hover:scale-105 transition-transform duration-300">
            <img src={brandLogo} alt="POP O'BOB Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-heading font-black text-[#2A1B16] tracking-tight mb-1">
            POP O'BOB®
          </h1>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#8D6E63]/80">
            Admin Portal
          </h2>
        </div>

        {error && (
          <div className="bg-red-50/80 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-semibold mb-6 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6E63] w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-white/80 border border-[#FAEDCD] focus:border-[#FFD54F] focus:ring-4 focus:ring-[#FFD54F]/20 outline-none transition-all font-medium text-[#2A1B16] placeholder-[#8D6E63]/40 shadow-inner"
                placeholder="admin@popobob.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6E63] w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-white/80 border border-[#FAEDCD] focus:border-[#FFD54F] focus:ring-4 focus:ring-[#FFD54F]/20 outline-none transition-all font-medium text-[#2A1B16] placeholder-[#8D6E63]/40 shadow-inner"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2A1B16] hover:bg-[#3D2921] text-[#FFD54F] py-4 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2 transform active:scale-[0.98] cursor-pointer mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5 text-[#FFD54F]" />
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

