import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { loginUser, registerUser } from '../../api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setIsForgot(false);
    setForgotSent(false);
    setError('');
    setName('');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Simulate sending reset link (wire to real API when ready)
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setForgotSent(true);
  };

  const goToForgot = () => {
    setIsForgot(true);
    setForgotSent(false);
    setError('');
  };

  const goBackToLogin = () => {
    setIsForgot(false);
    setForgotSent(false);
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-[201] flex items-end md:items-center justify-center pointer-events-none px-0 md:px-4"
          >
            <div className="pointer-events-auto w-full md:max-w-[900px] md:h-[540px] bg-white md:rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.25)] flex flex-col md:flex-row rounded-t-[2rem]">

              {/* ========================================================================= */}
              {/* LEFT PANEL — Brand Identity (Desktop Only) */}
              {/* ========================================================================= */}
              <div className="hidden md:flex md:w-[42%] flex-col justify-between p-10 xl:p-12 relative overflow-hidden bg-[#1A0B05]">
                {/* Rich warm texture background blobs */}
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#D4AF37]/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-20 -right-10 w-64 h-64 bg-[#FFC461]/15 rounded-full blur-[80px] pointer-events-none" />

                {/* Logo Area */}
                <div>
                  <img
                    src="/assets/horizontal_logo.png"
                    alt="POP O'BOB® Logo"
                    className="h-10 w-auto object-contain brightness-0 invert mb-10"
                  />
                  <h2 className="text-white font-black text-3xl xl:text-4xl leading-tight tracking-tight mb-4">
                  {isForgot ? 'Reset your\npassword.' : isLogin ? 'Good to see\nyou again.' : 'Start your\nluxury journey.'}
                </h2>
                <p className="text-white/50 text-sm font-medium leading-relaxed">
                  {isForgot
                    ? 'Enter your email and we will send you a link to reset your password right away.'
                    : isLogin
                    ? 'Log in to earn Boba Points, track your orders, and reorder your favourites in seconds.'
                    : 'Create your account and start earning Boba Points on every single order.'}
                </p>
                </div>

                {/* Bottom Brand Tagline */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[2px] bg-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.25em]">
                    Luxury Bubble Tea Co.
                  </span>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* RIGHT PANEL — Form */}
              {/* ========================================================================= */}
              <div className="flex-1 flex flex-col justify-between bg-[#FDFCF9] p-7 md:p-10 xl:p-12 relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 md:top-7 md:right-7 w-9 h-9 flex items-center justify-center bg-black/5 hover:bg-black/10 rounded-full text-gray-500 hover:text-gray-800 transition-colors z-10"
                >
                  <X size={18} />
                </button>

                {/* Mobile Brand Header */}
                <div className="md:hidden mb-6">
                  <img
                    src="/assets/horizontal_logo.png"
                    alt="POP O'BOB® Logo"
                    className="h-8 w-auto object-contain mb-3"
                  />
                </div>

                {/* Form Header */}
                <div className="mb-7">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-2">
                    {isForgot ? 'Password Reset' : isLogin ? 'Member Login' : 'Create Account'}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-black text-[#1A0B05] tracking-tight leading-tight">
                    {isForgot ? 'Forgot Password?' : isLogin ? 'Welcome back' : "Join POP O'BOB®"}
                  </h3>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mb-5 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ============================================================ */}
                {/* FORGOT PASSWORD FLOW */}
                {/* ============================================================ */}
                {isForgot && (
                  <div className="flex flex-col gap-4 flex-1">
                    {forgotSent ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center flex-1 text-center gap-4"
                      >
                        <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 flex items-center justify-center mb-2">
                          <span className="text-3xl">✉️</span>
                        </div>
                        <h4 className="text-xl font-black text-[#1A0B05]">Check your inbox</h4>
                        <p className="text-sm text-gray-500 font-medium max-w-xs leading-relaxed">
                          We've sent a reset link to <span className="font-bold text-[#1A0B05]">{email}</span>. Check your inbox and follow the instructions.
                        </p>
                        <button
                          onClick={goBackToLogin}
                          className="mt-4 text-sm font-black text-[#D4AF37] hover:text-[#1A0B05] transition-colors underline underline-offset-2"
                        >
                          Back to Log In
                        </button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleForgotPassword} className="flex flex-col gap-3.5">
                        <p className="text-sm text-gray-500 font-medium -mt-3 mb-2 leading-relaxed">
                          Enter your registered email address and we'll send you a reset link.
                        </p>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                          <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-sm font-semibold text-[#1A0B05] placeholder:text-gray-400 transition-all"
                          />
                        </div>
                        <button
                          disabled={loading}
                          type="submit"
                          className="mt-1 w-full bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] font-black rounded-full py-4 text-sm tracking-wide shadow-lg hover:shadow-[0_8px_24px_rgba(212,175,55,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 group"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                              </svg>
                              Sending...
                            </span>
                          ) : (
                            <><span>Send Reset Link</span><ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={goBackToLogin}
                          className="text-sm font-bold text-gray-400 hover:text-[#1A0B05] transition-colors text-center mt-1"
                        >
                          ← Back to Log In
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* ============================================================ */}
                {/* LOGIN / SIGN UP FLOW */}
                {/* ============================================================ */}
                {!isForgot && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 flex-1">
                  {/* Name (Sign Up only) */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative overflow-hidden"
                      >
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                          <input
                            type="text"
                            placeholder="Full Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-sm font-semibold text-[#1A0B05] placeholder:text-gray-400 transition-all"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-sm font-semibold text-[#1A0B05] placeholder:text-gray-400 transition-all"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-sm font-semibold text-[#1A0B05] placeholder:text-gray-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  {/* Forgot Password Link (Login only) */}
                  {isLogin && (
                    <div className="flex justify-end -mt-1">
                      <button
                        type="button"
                        onClick={goToForgot}
                        className="text-xs font-bold text-gray-400 hover:text-[#D4AF37] transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    disabled={loading}
                    type="submit"
                    className="mt-1 w-full bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] font-black rounded-full py-4 text-sm tracking-wide shadow-lg hover:shadow-[0_8px_24px_rgba(212,175,55,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 group"
                  >
                    {loading ? (
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
                )}

                {/* Switch Mode */}
                <div className="mt-6 text-center">
                  <span className="text-sm text-gray-500 font-medium">
                    {isLogin ? "Don't have an account? " : 'Already a member? '}
                    <button
                      onClick={switchMode}
                      className="text-[#D4AF37] hover:text-[#1A0B05] font-black ml-1 transition-colors"
                    >
                      {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
