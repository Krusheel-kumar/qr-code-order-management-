import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { loginUser, registerUser } from '../../api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const user = await loginUser({ email, password });
        setUser(user);
        onClose();
      } else {
        const user = await registerUser({ name, email, password });
        setUser(user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 bg-[#FFFBF2] rounded-t-[2rem] z-[101] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-center p-6 pb-2">
              <h2 className="font-heading font-black text-2xl text-gray-900">
                {isLogin ? 'Welcome Back' : "Join POP O'BOB®"}
              </h2>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 pb-8">
              <p className="text-sm text-gray-500 mb-6">
                {isLogin ? 'Log in to earn points and reorder favorites.' : 'Sign up to earn Boba points on every order!'}
              </p>

              {error && <div className="mb-4 text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {!isLogin && (
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
                  disabled={loading}
                  type="submit" 
                  className="mt-2 w-full bg-[#1A0B05] text-white font-extrabold rounded-full py-4 text-[15px] shadow-[0_8px_20px_rgba(26,11,5,0.2)] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-sm text-gray-500 font-medium">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={() => setIsLogin(!isLogin)} className="text-[#FF8F00] font-extrabold ml-1">
                    {isLogin ? 'Sign Up' : 'Log In'}
                  </button>
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
