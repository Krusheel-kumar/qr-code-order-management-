import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { verifyWidgetToken } from '../../api';

declare global {
  interface Window {
    initSendOTP: (config: any) => void;
    sendOTP: (phone: string, countryCode: string) => void;
    verifyOtp: (otp: string | number) => void;
    verifyOTP: (otp: string) => void;
    configuration: any;
  }
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const setUser = useAuthStore(state => state.setUser);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setPhoneNumber('');
      setOtp(['', '', '', '']);
      setError('');
    } else {
      // MSG91 SDK is loaded via index.html, we don't initialize here anymore.
    }
  }, [isOpen, phoneNumber]);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      let formattedPhone = phoneNumber.replace('+', '');
      if (!formattedPhone.startsWith('91')) formattedPhone = '91' + formattedPhone;

      window.configuration = {
        widgetId: "3668656e7541363234303538", 
        tokenAuth: "557539Tl9kAR3zw36a7347b5P1", 
        identifier: formattedPhone,
        exposeMethods: "true",
        success: async (data: any) => {
          try {
            const dataResp = await verifyWidgetToken({ token: data.message, phoneNumber: formattedPhone });
            setUser(dataResp.user);
            setLoading(false);
            if (dataResp.isNewUser) {
              setStep(3);
            } else {
              onClose();
            }
          } catch (err: any) {
            setError(err.message || 'Verification failed on server.');
            setLoading(false);
          }
        },
        failure: (err: any) => {
          setError(err.message || 'OTP Verification failed.');
          setLoading(false);
        }
      };

      if (window.initSendOTP) {
        window.initSendOTP(window.configuration);
        setStep(2);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        setError('MSG91 SDK not loaded yet. Please wait a moment and try again.');
      }
      setLoading(false);
    } catch (err: any) {
      setError('Failed to initialize OTP widget. Please reload the page.');
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      setError('Please enter the complete 4-digit OTP');
      return;
    }
    setError('');
    setLoading(true);

    try {
      if (typeof window.verifyOtp === 'function') {
        window.verifyOtp(otpCode);
      } else if (typeof window.verifyOTP === 'function') {
        window.verifyOTP(otpCode);
      } else {
        throw new Error("Missing verify function. Available: " + Object.keys(window).filter(k => k.toLowerCase().includes('otp') || k.toLowerCase().includes('verify') || k.toLowerCase().includes('msg91')).join(', '));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP with MSG91.');
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Please enter a valid name');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const { user } = useAuthStore.getState();
      if (user && user.id) {
        // We will add updateUserProfile to api/index.ts
        const { updateUserProfile } = await import('../../api');
        const updatedUser = await updateUserProfile(user.id, { username: name });
        setUser(updatedUser);
      }
      onClose();
    } catch(err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
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
                  {step === 1 ? 'Enter your\nmobile number.' : step === 2 ? 'Verify your\nnumber.' : 'What should\nwe call you?'}
                  </h2>
                  <p className="text-white/50 text-sm font-medium leading-relaxed">
                    {step === 1 
                      ? 'Log in to earn Boba Points, track your orders, and reorder your favourites in seconds.'
                      : step === 2 
                      ? `We've sent a 4-digit code to your phone. Enter it to continue.`
                      : 'Complete your profile to get personalized recommendations and guest rewards.'}
                  </p>
                </div>

                {/* Bottom Brand Tagline */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[2px] bg-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em]">
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
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-2 flex items-center gap-2">
                    <ShieldCheck size={14} /> SECURE LOGIN
                  </p>
                  <h3 className="text-2xl md:text-3xl font-black text-[#1A0B05] tracking-tight leading-tight">
                    {step === 1 ? "Join POP O'BOB®" : step === 2 ? "Enter OTP Code" : "Complete Profile"}
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
                {/* STEP 1: PHONE NUMBER */}
                {/* ============================================================ */}
                {step === 1 && (
                  <form onSubmit={handleRequestOtp} className="flex flex-col gap-3.5 flex-1 justify-center">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 pr-3">
                        <Phone className="text-gray-400" size={17} />
                        <span className="text-gray-500 font-bold text-sm">+91</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        maxLength={10}
                        className="w-full bg-white border border-gray-200 rounded-2xl pl-24 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-sm font-semibold text-[#1A0B05] placeholder:text-gray-400 transition-all"
                      />
                    </div>
                    
                    <button
                      disabled={loading || phoneNumber.length < 10}
                      type="submit"
                      className="mt-4 w-full bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] font-black rounded-full py-4 text-sm tracking-wide shadow-lg hover:shadow-[0_8px_24px_rgba(212,175,55,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 group"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Sending OTP...
                        </span>
                      ) : (
                        <>
                          <span>Continue</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ============================================================ */}
                {/* STEP 2: VERIFY OTP */}
                {/* ============================================================ */}
                {step === 2 && (
                  <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3.5 flex-1 justify-center">
                    <p className="text-sm text-gray-500 font-medium mb-4">
                      Sent to +91 {phoneNumber} • <button type="button" onClick={() => setStep(1)} className="text-[#D4AF37] hover:text-[#1A0B05] font-bold underline">Edit</button>
                    </p>
                    
                    <div className="flex gap-4 justify-center mb-6">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-14 h-16 text-center text-2xl font-black bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all"
                        />
                      ))}
                    </div>

                    <button
                      disabled={loading || otp.join('').length !== 4}
                      type="submit"
                      className="mt-1 w-full bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] font-black rounded-full py-4 text-sm tracking-wide shadow-lg hover:shadow-[0_8px_24px_rgba(212,175,55,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 group"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Verifying...
                        </span>
                      ) : (
                        <>
                          <span>Verify & Login</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    
                    <div className="mt-6 text-center">
                      <span className="text-sm text-gray-500 font-medium">
                        Didn't receive the code?{' '}
                        <button
                          type="button"
                          onClick={handleRequestOtp}
                          disabled={loading}
                          className="text-[#D4AF37] hover:text-[#1A0B05] font-black ml-1 transition-colors disabled:opacity-50"
                        >
                          Resend OTP
                        </button>
                      </span>
                    </div>
                  </form>
                )}

                {/* ============================================================ */}
                {/* STEP 3: NAME REGISTRATION */}
                {/* ============================================================ */}
                {step === 3 && (
                  <form onSubmit={handleNameSubmit} className="flex flex-col gap-3.5 flex-1 justify-center">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-sm font-semibold text-[#1A0B05] placeholder:text-gray-400 transition-all"
                      />
                    </div>
                    
                    <button
                      disabled={loading || name.trim().length < 2}
                      type="submit"
                      className="mt-4 w-full bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] font-black rounded-full py-4 text-sm tracking-wide shadow-lg hover:shadow-[0_8px_24px_rgba(212,175,55,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 group"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        <>
                          <span>Complete Profile</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
                
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
