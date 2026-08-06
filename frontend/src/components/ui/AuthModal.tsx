import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ShieldCheck } from 'lucide-react';
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
        widgetId: import.meta.env.VITE_MSG91_WIDGET_ID || "3668656e7541363234303538", 
        tokenAuth: import.meta.env.VITE_MSG91_TOKEN_AUTH || "557539Tl9kAR3zw36a7347b5P1", 
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
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[10000]"
          />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 40 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-0 z-[10001] flex items-end md:items-center justify-center pointer-events-none p-0 md:p-6"
            >
              <div className="pointer-events-auto w-full md:max-w-[420px] bg-white md:rounded-[2rem] rounded-t-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.15)] flex flex-col relative pb-safe">
                
                {/* Drag Handle (Mobile) */}
                <div className="w-full flex justify-center pt-4 pb-2 md:hidden">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-800 transition-colors z-10"
                >
                  <X size={16} />
                </button>

                <div className="p-8 pt-4 md:pt-10 flex flex-col">
                  {/* Icon Header */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFFBF2] to-[#FFF0D4] border border-[#D4AF37]/20 flex items-center justify-center shadow-sm relative">
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-2xl"></div>
                      <ShieldCheck className="text-[#D4AF37] relative z-10" size={28} />
                    </div>
                  </div>

                  {/* Form Header */}
                  <div className="mb-8 text-center">
                    <h3 className="text-2xl font-black text-[#1A0B05] tracking-tight leading-tight mb-2">
                      {step === 1 ? "Welcome to POP O'BOB" : step === 2 ? "Verify Your Number" : "Complete Profile"}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 leading-relaxed px-4">
                      {step === 1 
                        ? 'Enter your mobile number to securely log in or join our rewards program.'
                        : step === 2 
                        ? <>Enter the 4-digit code sent to <br/><span className="font-bold text-[#1A0B05]">+91 {phoneNumber}</span></>
                        : 'Almost there! What should we call you?'}
                    </p>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-center">
                          {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ============================================================ */}
                  {/* STEP 1: PHONE NUMBER */}
                  {/* ============================================================ */}
                  {step === 1 && (
                    <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 pr-3 transition-colors group-focus-within:border-[#D4AF37]/30">
                          <span className="text-gray-800 font-bold text-sm">+91</span>
                        </div>
                        <input
                          type="tel"
                          placeholder="Mobile Number"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          maxLength={10}
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-20 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/10 focus:border-[#D4AF37] focus:bg-white text-base font-bold text-[#1A0B05] placeholder:text-gray-400 placeholder:font-medium transition-all"
                        />
                      </div>
                      
                      <button
                        disabled={loading || phoneNumber.length < 10}
                        type="submit"
                        className="w-full bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] font-black rounded-2xl py-4.5 text-sm tracking-widest uppercase shadow-lg shadow-[#1A0B05]/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-2"
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
                          <>
                            <span>Continue</span>
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* ============================================================ */}
                  {/* STEP 2: VERIFY OTP */}
                  {/* ============================================================ */}
                  {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                      <div className="flex gap-3 justify-center mb-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="w-14 h-16 text-center text-2xl font-black bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/10 focus:border-[#D4AF37] focus:bg-white text-[#1A0B05] transition-all shadow-sm"
                          />
                        ))}
                      </div>

                      <button
                        disabled={loading || otp.join('').length !== 4}
                        type="submit"
                        className="w-full bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] font-black rounded-2xl py-4.5 text-sm tracking-widest uppercase shadow-lg shadow-[#1A0B05]/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
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
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                      
                      <div className="text-center mt-2 flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-xs text-gray-500 font-bold hover:text-[#1A0B05] transition-colors"
                        >
                          Change Mobile Number
                        </button>
                        <button
                          type="button"
                          onClick={handleRequestOtp}
                          disabled={loading}
                          className="text-xs text-[#D4AF37] font-bold hover:text-[#1A0B05] transition-colors disabled:opacity-50"
                        >
                          Resend OTP Code
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ============================================================ */}
                  {/* STEP 3: NAME REGISTRATION */}
                  {/* ============================================================ */}
                  {step === 3 && (
                    <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Your Full Name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/10 focus:border-[#D4AF37] focus:bg-white text-base font-bold text-[#1A0B05] placeholder:text-gray-400 placeholder:font-medium transition-all text-center"
                        />
                      </div>
                      
                      <button
                        disabled={loading || name.trim().length < 2}
                        type="submit"
                        className="w-full bg-[#1A0B05] hover:bg-[#D4AF37] text-white hover:text-[#1A0B05] font-black rounded-2xl py-4.5 text-sm tracking-widest uppercase shadow-lg shadow-[#1A0B05]/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-2"
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
                            <ArrowRight size={16} />
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
