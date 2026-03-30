'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeSlide = (dir: 1 | -1 = 1) => ({
  initial: { opacity: 0, x: dir * 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } },
  exit:    { opacity: 0, x: dir * -24, transition: { duration: 0.2, ease: EASE } },
});

// ─── OTP Input ────────────────────────────────────────────────────────────────

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  function handleChange(i: number, char: string) {
    const digits = char.replace(/\D/g, '');
    if (!digits) return;
    const next = value.split('');
    next[i] = digits[0];
    onChange(next.join('').padEnd(6, '').slice(0, 6));
    if (i < 5) refs[i + 1].current?.focus();
  }

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      const next = value.split('');
      if (next[i]) {
        next[i] = '';
        onChange(next.join(''));
      } else if (i > 0) {
        refs[i - 1].current?.focus();
        const prev = value.split('');
        prev[i - 1] = '';
        onChange(prev.join(''));
      }
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    refs[Math.min(pasted.length, 5)].current?.focus();
    e.preventDefault();
  }

  return (
    <div className="flex gap-2 sm:gap-3 justify-between">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          autoFocus={i === 0}
          className={`w-full aspect-square max-w-[52px] text-center text-xl font-black rounded-xl border-2 bg-gray-50 focus:outline-none transition-all ${
            value[i]
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-gray-200 text-gray-900 focus:border-primary focus:bg-white'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Resend countdown ─────────────────────────────────────────────────────────

function ResendTimer({ onResend }: { onResend: () => void }) {
  const [secs, setSecs] = useState(60);

  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  return secs > 0 ? (
    <p className="text-xs text-gray-400 text-center">
      Resend code in <span className="font-bold text-gray-600">{secs}s</span>
    </p>
  ) : (
    <button
      onClick={() => { onResend(); setSecs(60); }}
      className="w-full text-xs font-bold text-primary hover:underline text-center"
    >
      Resend OTP
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Step = 'email' | 'otp' | 'newpass' | 'done';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [dir, setDir] = useState<1 | -1>(1);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('      ');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function go(next: Step, direction: 1 | -1 = 1) {
    setDir(direction);
    setError('');
    setStep(next);
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // TODO: supabase.auth.resetPasswordForEmail(email, { redirectTo: '...' })
    // For now simulate sending OTP
    setTimeout(() => { setLoading(false); go('otp'); }, 800);
  }

  function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.trim();
    if (code.length < 6) { setError('Please enter the full 6-digit code.'); return; }
    setLoading(true);
    // TODO: supabase.auth.verifyOtp({ email, token: code, type: 'recovery' })
    setTimeout(() => {
      setLoading(false);
      // Simulate wrong OTP for demo: any code works
      go('newpass');
    }, 800);
  }

  function handleNewPass(e: React.FormEvent) {
    e.preventDefault();
    if (newPass.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPass !== confirmPass) { setError('Passwords do not match.'); return; }
    setLoading(true);
    // TODO: supabase.auth.updateUser({ password: newPass })
    setTimeout(() => { setLoading(false); go('done'); }, 800);
  }

  const variants = fadeSlide(dir);

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">

      {/* ── Left: Form ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col px-6 py-8 sm:px-10 lg:px-14 xl:px-20">
        <Link href="/" className="flex items-center gap-2 mb-8 lg:mb-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="font-black text-gray-900 tracking-tight text-lg">Solarsas</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto lg:mx-0 py-8 lg:py-0 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>

            {/* ── Step 1: Email ─────────────────────────────────────────── */}
            {step === 'email' && (
              <motion.div key="email" {...variants}>
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">Forgot password?</h1>
                <p className="text-gray-400 text-sm mb-8">
                  Enter your email and we&apos;ll send a 6-digit code to reset your password.
                </p>
                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                    <input
                      type="email" required autoFocus
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 bg-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary transition-all"
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    {loading ? 'Sending...' : 'Send Reset Code'}
                  </button>
                  <Link href="/login" className="text-center text-xs text-gray-400 hover:text-gray-700 transition-colors">
                    ← Back to login
                  </Link>
                </form>
              </motion.div>
            )}

            {/* ── Step 2: OTP ───────────────────────────────────────────── */}
            {step === 'otp' && (
              <motion.div key="otp" {...variants}>
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">Check your email</h1>
                <p className="text-gray-400 text-sm mb-2">
                  We sent a 6-digit code to
                </p>
                <p className="text-sm font-bold text-gray-900 mb-8">{email}</p>

                <form onSubmit={handleOtpSubmit} className="flex flex-col gap-5">
                  <OtpInput value={otp} onChange={setOtp} />

                  {error && (
                    <p className="text-xs text-red-500 font-medium text-center">{error}</p>
                  )}

                  <button
                    type="submit" disabled={loading || otp.trim().length < 6}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>

                  <ResendTimer onResend={() => {
                    // TODO: supabase.auth.resetPasswordForEmail(email)
                    console.log('Resending OTP to', email);
                  }} />

                  <button
                    type="button"
                    onClick={() => go('email', -1)}
                    className="text-center text-xs text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    ← Change email
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── Step 3: New password ───────────────────────────────────── */}
            {step === 'newpass' && (
              <motion.div key="newpass" {...variants}>
                <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">Set new password</h1>
                <p className="text-gray-400 text-sm mb-8">
                  Code verified. Choose a strong password for your account.
                </p>
                <form onSubmit={handleNewPass} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'} required autoFocus
                        placeholder="At least 8 characters"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        className="w-full px-4 py-3.5 pr-11 bg-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPass ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {/* Strength bar */}
                    {newPass.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4].map((n) => {
                          const strength = Math.min(Math.floor(newPass.length / 3), 4);
                          return (
                            <div key={n} className={`flex-1 h-1 rounded-full transition-colors ${
                              n <= strength
                                ? strength <= 1 ? 'bg-red-400'
                                : strength <= 2 ? 'bg-yellow-400'
                                : strength <= 3 ? 'bg-blue-400'
                                : 'bg-green-500'
                                : 'bg-gray-200'
                            }`} />
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                    <input
                      type={showPass ? 'text' : 'password'} required
                      placeholder="Repeat password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className={`w-full px-4 py-3.5 bg-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 border transition-all ${
                        confirmPass && confirmPass !== newPass
                          ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                          : 'border-transparent focus:ring-primary/20 focus:border-primary'
                      }`}
                    />
                    {confirmPass && confirmPass !== newPass && (
                      <p className="text-xs text-red-500 mt-1.5">Passwords don&apos;t match</p>
                    )}
                  </div>

                  {error && (
                    <p className="text-xs text-red-500 font-medium">{error}</p>
                  )}

                  <button
                    type="submit" disabled={loading}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                  >
                    {loading && (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    {loading ? 'Saving...' : 'Reset Password'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── Step 4: Done ──────────────────────────────────────────── */}
            {step === 'done' && (
              <motion.div key="done" {...variants} className="text-center flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6"
                >
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </motion.div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Password reset!</h1>
                <p className="text-gray-400 text-sm mb-8 max-w-xs">
                  Your password has been updated. You can now log in with your new password.
                </p>
                <Link
                  href="/login"
                  className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-sm text-center block"
                >
                  Back to Login
                </Link>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <Link href="mailto:hello@solarsas.com" className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors mt-8 lg:mt-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
          hello@solarsas.com
        </Link>
      </div>

      {/* ── Right: Visual ───────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[52%] p-5">
        <div className="relative w-full rounded-3xl overflow-hidden bg-primary flex flex-col">
          {/* Step progress indicators */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {(['email', 'otp', 'newpass', 'done'] as Step[]).map((s, i) => {
              const current = ['email', 'otp', 'newpass', 'done'].indexOf(step);
              const idx = i;
              return (
                <div key={s} className={`rounded-full transition-all duration-300 ${
                  idx < current ? 'w-5 h-2 bg-white' :
                  idx === current ? 'w-8 h-2 bg-white' :
                  'w-2 h-2 bg-white/30'
                }`} />
              );
            })}
          </div>

          <div className="flex-1 flex items-center justify-center px-8 pt-20 pb-8">
            <div className="w-full max-w-xs">
              {/* Animated icon per step */}
              <AnimatePresence mode="wait">
                {step === 'email' && (
                  <motion.div key="vi-email" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: EASE }}>
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
                      <p className="text-white/50 text-xs mb-3 uppercase tracking-widest">Security</p>
                      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                        </svg>
                      </div>
                      <p className="text-white font-bold">Account recovery</p>
                      <p className="text-white/50 text-xs mt-1">We&apos;ll verify it&apos;s really you</p>
                    </div>
                  </motion.div>
                )}
                {step === 'otp' && (
                  <motion.div key="vi-otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: EASE }}>
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
                      <p className="text-white/50 text-xs mb-4 uppercase tracking-widest">Your code</p>
                      <div className="flex gap-2 mb-4">
                        {['•','•','•','•','•','•'].map((d, i) => (
                          <div key={i} className="flex-1 aspect-square bg-white/20 rounded-xl flex items-center justify-center text-white font-black text-lg">{d}</div>
                        ))}
                      </div>
                      <p className="text-white/50 text-xs">Check your inbox — it expires in 10 minutes</p>
                    </div>
                  </motion.div>
                )}
                {(step === 'newpass' || step === 'done') && (
                  <motion.div key="vi-pass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: EASE }}>
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${step === 'done' ? 'bg-green-400/30' : 'bg-white/20'}`}>
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          {step === 'done'
                            ? <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            : <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                          }
                        </svg>
                      </div>
                      <p className="text-white font-bold">{step === 'done' ? 'All done!' : 'Almost there'}</p>
                      <p className="text-white/50 text-xs mt-1">{step === 'done' ? 'Your account is secure again.' : 'Set a strong password you\'ll remember.'}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="px-8 pb-6">
            <h2 className="text-white text-3xl font-bold leading-tight tracking-tight mb-1">
              {step === 'done' ? 'Back in business.' : 'Locked out? No stress.'}
            </h2>
            <p className="text-white/60 text-sm">
              {step === 'done' ? 'Log in and get back to closing deals.' : 'We\'ll have you back in your dashboard in 2 minutes.'}
            </p>
          </div>

          <div className="flex items-center gap-2 px-8 pb-8">
            {(['email', 'otp', 'newpass', 'done'] as Step[]).map((s, i) => (
              <div key={s} className={`rounded-full transition-all duration-300 ${
                step === s ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/30'
              }`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
