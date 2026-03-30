'use client';

import Link from 'next/link';
import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const OTP_LENGTH = 6;

// 1. Rename your main component to 'VerifyContent'
function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const filled = digits.filter(Boolean).length;

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  function updateDigit(index: number, value: string) {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    if (cleaned && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    if (cleaned && index === OTP_LENGTH - 1 && next.join('').length === OTP_LENGTH) verifyCode(next.join(''));
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[index]) { const n = [...digits]; n[index] = ''; setDigits(n); }
      else if (index > 0) inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    if (pasted.length === OTP_LENGTH) verifyCode(pasted);
  }

  async function verifyCode(code?: string) {
    const token = code ?? digits.join('');
    if (token.length !== OTP_LENGTH) { setError('Please enter all 6 digits.'); return; }
    setError('');
    setLoading(true);
    // TODO: supabase.auth.verifyOtp({ email, token, type: 'signup' })
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.push('/dashboard');
  }

  function handleResend() {
    // TODO: supabase.auth.resend({ type: 'signup', email })
    setResent(true);
    setTimeout(() => setResent(false), 4000);
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 w-full">
        <div className="w-full max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 mx-auto">
            <svg className="w-7 h-7 text-[#0061FE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight text-center mb-2">Check your email</h1>
          <p className="text-sm text-gray-400 text-center mb-1">We sent a 6-digit code to</p>
          <p className="text-sm font-semibold text-gray-700 text-center mb-8 truncate px-4">{email || 'your email address'}</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-4 py-3 mb-5">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {error}
            </div>
          )}

          {resent && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-600 text-xs rounded-xl px-4 py-3 mb-5">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              New code sent — check your inbox.
            </div>
          )}

          {/* OTP boxes */}
          <div className="flex gap-2 sm:gap-3 justify-center mb-5">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text" inputMode="numeric" maxLength={1}
                value={digit}
                onChange={(e) => updateDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className={`w-11 h-14 sm:w-12 text-center text-xl font-black rounded-xl transition-all focus:outline-none border-2 ${
                  digit ? 'bg-[#0061FE] text-white border-[#0061FE]' : 'bg-gray-100 text-gray-900 border-transparent focus:border-[#0061FE]/40'
                }`}
              />
            ))}
          </div>

          {/* Progress */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < filled ? 'bg-[#0061FE]' : 'bg-gray-100'}`} />
            ))}
          </div>

          <button
            onClick={() => verifyCode()}
            disabled={loading || filled < OTP_LENGTH}
            className="w-full flex items-center justify-center gap-2 bg-[#0061FE] text-white font-semibold py-3.5 rounded-xl hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying…
              </>
            ) : 'Verify Email'}
          </button>

          <p className="text-center text-sm text-gray-400 mt-5">
            Didn&apos;t get a code?{' '}
            <button onClick={handleResend} className="text-[#0061FE] font-semibold hover:underline">Resend</button>
          </p>
          <p className="text-center text-sm text-gray-400 mt-2">
            Wrong email?{' '}
            <Link href="/register" className="text-[#0061FE] font-semibold hover:underline">Go back</Link>
          </p>
        </div>
      </div>
  );
}

// 2. Create the new default export that wraps the content in Suspense
export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-8 sm:px-10">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#0061FE] flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <span className="font-black text-gray-900 tracking-tight text-lg">Solarsas</span>
      </Link>

      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center py-12">
           <svg className="w-8 h-8 text-[#0061FE] animate-spin" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
           </svg>
        </div>
      }>
        <VerifyContent />
      </Suspense>

      <Link href="mailto:hello@solarsas.com" className="flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
        hello@solarsas.com
      </Link>
    </div>
  );
}