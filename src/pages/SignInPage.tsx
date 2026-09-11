import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ArrowLeft, 
  Phone, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Radio, 
  Send,
  Lock,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { authService } from '../services/authService';
import type { AuthUser } from '../types';

interface SignInPageProps {
  onSuccessSignIn: (user: AuthUser) => void;
  onBackToLanding?: () => void;
}

export function SignInPage({ onSuccessSignIn, onBackToLanding }: SignInPageProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setStatusMessage(null);

    const clean = phoneNumber.trim().replace(/[^0-9+]/g, '');
    if (clean.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.sendOtp(phoneNumber);
      setIsLoading(false);

      if (result.success) {
        setStep('otp');
        setCountdown(45);
        setStatusMessage(result.message);
        if (result.devOtp) {
          setDevOtpCode(result.devOtp);
        }
      } else {
        setError(result.message || 'Failed to dispatch OTP. Please try again.');
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const errObj = err as Error;
      setError(errObj?.message || 'Error communicating with TextBee authentication gateway.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.trim().length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.verifyOtp(phoneNumber, otp);
      setIsLoading(false);

      if (result.success && result.user) {
        onSuccessSignIn(result.user);
      } else {
        setError(result.error || 'Invalid OTP code.');
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const errObj = err as Error;
      setError(errObj?.message || 'Verification failed. Please try again.');
    }
  };

  const handleQuickDemoSignIn = () => {
    setIsLoading(true);
    setError(null);
    const demoUser = authService.createSessionUser('+919876543210');
    setTimeout(() => {
      setIsLoading(false);
      onSuccessSignIn(demoUser);
    }, 300);
  };

  const fillTestOtp = () => {
    if (devOtpCode) {
      setOtp(devOtpCode);
    } else {
      setOtp('123456');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-blue-600/20 selection:text-blue-900">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-slate-200 py-4 px-4 sm:px-8 flex items-center justify-between">
        {onBackToLanding ? (
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Public Site & Overview</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="p-1 rounded-md bg-blue-50 text-blue-600 border border-blue-200">
              <Lock className="w-3.5 h-3.5" />
            </span>
            <span className="tracking-wide font-medium text-slate-700">
              Secure Gateway &bull; Authentication Required
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-medium text-slate-600">
            TextBee Gateway: Connected
          </span>
        </div>
      </header>

      {/* Main Sign-In Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-count-up">
          
          {/* Brand Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-display font-extrabold text-xl tracking-tight text-white">
                  NER-Logistics
                </h1>
                <p className="text-xs text-blue-100 font-medium">
                  Operational Command & Strategic Access
                </p>
              </div>
            </div>

            <p className="text-xs text-blue-100/90 leading-relaxed mt-1">
              Sign in with your mobile credentials or use instant demo access to enter the Logistics Command Console & Strategic Operations Platform.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-5">
            
            {/* Error Notification */}
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-snug">{error}</div>
              </div>
            )}

            {/* Status Notification */}
            {statusMessage && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-800">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="leading-snug">{statusMessage}</div>
              </div>
            )}

            {/* Fallback Dev OTP Notice */}
            {devOtpCode && step === 'otp' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Verification Code: <strong className="font-mono text-sm tracking-wider">{devOtpCode}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={fillTestOtp}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline"
                >
                  Auto Fill
                </button>
              </div>
            )}

            {/* Step 1: Phone Number Input */}
            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      autoFocus
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>A 6-digit OTP will be dispatched via TextBee SMS Gateway.</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full ner-btn-primary py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending OTP via TextBee...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Verification Code</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: OTP Verification */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Enter 6-Digit OTP
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Change Number
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-lg font-mono font-bold tracking-[0.35em] text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      autoFocus
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Sent to <strong className="text-slate-700">{phoneNumber}</strong>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full ner-btn-primary py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Enter Platform</span>
                    </>
                  )}
                </button>

                {/* Resend Link */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Didn't receive the SMS?</span>
                  <button
                    type="button"
                    disabled={countdown > 0 || isLoading}
                    onClick={() => handleSendOtp()}
                    className="text-blue-700 font-semibold hover:underline disabled:text-slate-400 disabled:no-underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Quick Demo Access Button */}
            <div className="pt-2">
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-2.5 text-slate-400 font-bold font-mono tracking-wider">
                    Or Instant Evaluation Access
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleQuickDemoSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all border border-slate-300 shadow-sm hover:border-blue-400 hover:text-blue-700"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Quick Sign-In as Field Logistics Officer (Demo)</span>
              </button>
            </div>

            {/* TextBee Gateway Status Box */}
            <div className="pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center justify-between font-medium text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-blue-600 animate-pulse" />
                    TextBee SMS Gateway
                  </span>
                  <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                    Active API
                  </span>
                </div>
                <p className="text-slate-500 text-[10px]">
                  Key: <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono text-slate-600">txb_...8qzJ</code>
                </p>
                <p className="text-slate-500 text-[10px]">
                  Universal Demo Code for instant validation: <code className="font-bold text-blue-700 font-mono">123456</code>
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        © 2026 NER-Logistics. End-to-End Encrypted Telecom Session.
      </footer>
    </div>
  );
}
