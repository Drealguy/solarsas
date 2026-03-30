'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: supabase.auth.signInWithPassword({ email, password })
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">

      {/* ── Left: Form ── */}
      <div className="flex-1 flex flex-col px-6 py-8 sm:px-10 lg:px-14 xl:px-20">
        <Link href="/" className="flex items-center gap-2 mb-8 lg:mb-0">
          <div className="w-7 h-7 rounded-lg bg-[#0061FE] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="font-black text-gray-900 tracking-tight text-lg">Solarsas</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto lg:mx-0 py-8 lg:py-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-8">Log in to your brand dashboard.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email" required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0061FE]/20 focus:border-[#0061FE] border border-transparent transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#0061FE] font-semibold hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password" required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0061FE]/20 focus:border-[#0061FE] border border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0061FE] text-white font-semibold py-3.5 rounded-xl hover:bg-blue-600 transition-colors text-sm mt-1"
            >
              Sign In
            </button>

            <Link
              href="/register"
              className="w-full block text-center bg-blue-50 text-[#0061FE] font-semibold py-3.5 rounded-xl hover:bg-blue-100 transition-colors text-sm"
            >
              Create Account
            </Link>
          </form>
        </div>

        <Link href="mailto:hello@solarsas.com" className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors mt-8 lg:mt-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
          hello@solarsas.com
        </Link>
      </div>

      {/* ── Right: Visual (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[52%] p-5">
        <div className="relative w-full rounded-3xl overflow-hidden bg-[#0061FE] flex flex-col">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-white/95 text-[#0061FE] text-xs font-semibold px-5 py-2.5 rounded-full shadow-lg whitespace-nowrap">
              Free to get started
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-8 pt-20 pb-8">
            <div className="w-full max-w-xs space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Views', value: '1,284', delta: '+18%' },
                  { label: 'Leads', value: '94', delta: '+12%' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 border border-white/20 rounded-2xl p-4">
                    <p className="text-white/50 text-[10px] mb-1">{s.label}</p>
                    <p className="text-white text-xl font-black">{s.value}</p>
                    <p className="text-white/60 text-[10px] font-semibold mt-1">{s.delta} this month</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Latest Lead</span>
                  <span className="text-[10px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">New</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 text-white text-xs font-black flex items-center justify-center">B</div>
                  <div>
                    <p className="text-white text-sm font-bold">Bola Adeyemi</p>
                    <p className="text-white/40 text-xs">5.2 kW · +234 801 234 5678</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 pb-6">
            <h2 className="text-white text-3xl font-bold leading-tight tracking-tight mb-1">Your leads are waiting for you.</h2>
            <p className="text-white/60 text-sm">Log in and follow up before they go cold.</p>
          </div>

          <div className="flex items-center gap-2 px-8 pb-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`rounded-full ${i === 1 ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/30'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
