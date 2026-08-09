import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { verifyWidgetToken } from '../../api';
import { Button } from './Button';
import { Input } from './Input';
import { Sheet } from './Sheet';

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
  const [resendTimer, setResendTimer] = useState(30);
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

  // Resend Timer countdown logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  const handleRequestOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
            if (dataResp.token) {
              localStorage.setItem('auth_token', dataResp.token);
            }
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
        setResendTimer(30); // Start timer when OTP sent
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        throw new Error("MSG91 OTP script not loaded yet");
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
        setUser(updatedUser as any);
      }
      onClose();
    } catch(err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
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
                        <Input
                          type="tel"
                          placeholder="Mobile Number"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          maxLength={10}
                          className="pl-16 font-bold"
                        />
                      </div>
                      
                      <Button
                        disabled={loading || phoneNumber.length < 10}
                        type="submit"
                        className="mt-4 w-full"
                        size="lg"
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
                      </Button>
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
                            className="w-14 h-16 text-center text-2xl font-black bg-[var(--color-surface-muted)] border border-gray-100 rounded-[var(--radius-lg)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] focus:bg-white text-[var(--color-foreground)] transition-all shadow-[var(--shadow-soft-sm)]"
                          />
                        ))}
                      </div>

                      <Button
                        disabled={loading || otp.join('').length !== 4}
                        type="submit"
                        className="mt-4 w-full"
                        size="lg"
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
                      </Button>
                      
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
                          disabled={loading || resendTimer > 0}
                          className={`text-xs font-bold transition-colors ${resendTimer > 0 ? 'text-gray-400' : 'text-[#D4AF37] hover:text-[#1A0B05]'}`}
                        >
                          {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP Code'}
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
                        <Input
                          type="text"
                          placeholder="Your Full Name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="text-center font-bold"
                        />
                      </div>
                      
                      <Button
                        disabled={loading || name.trim().length < 2}
                        type="submit"
                        className="mt-2 w-full"
                        size="lg"
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
                      </Button>
                    </form>
                  )}
                  
      </div>
    </Sheet>
  );
}
