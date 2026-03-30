'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function toSlug(name: string) {
  return name.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 32);
}

const slides = [
  { badge: 'Free to get started', headline: 'The fastest way to close solar deals.', sub: 'Share a link. Get warm leads instantly.' },
  { badge: 'No WhatsApp back-and-forth', headline: 'Your branded calculator, running 24/7.', sub: 'Customers self-serve. You just follow up.' },
  { badge: 'Built for Nigeria', headline: 'Turn enquiries into pipeline, automatically.', sub: 'From Lagos to Kano — your leads in one place.' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [slide, setSlide] = useState(0);
  const slug = toSlug(businessName);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: supabase.auth.signUp()
    router.push(`/verify?email=${encodeURIComponent(email)}`);
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
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight mb-2">Create an account</h1>
          <p className="text-gray-400 text-sm mb-8">Set up your solar brand portal — free forever to start.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Name</label>
              <input
                type="text" required
                placeholder="Eg. Adewale Solar Solutions"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0061FE]/20 focus:border-[#0061FE] border border-transparent transition-all"
              />
              {slug && (
                <div className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                  <svg className="w-3 h-3 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                  <span className="text-xs font-mono text-blue-700 truncate"><strong>{slug}</strong>.solarsas.com</span>
                  <span className="ml-auto text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-md flex-shrink-0">✓ Available</span>
                </div>
              )}
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
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
              Create Account
            </button>

            <Link
              href="/login"
              className="w-full block text-center bg-blue-50 text-[#0061FE] font-semibold py-3.5 rounded-xl hover:bg-blue-100 transition-colors text-sm"
            >
              Sign In
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
          {/* Badge */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
            <div className="bg-white/95 text-[#0061FE] text-xs font-semibold px-5 py-2.5 rounded-full shadow-lg">
              {slides[slide].badge}
            </div>
          </div>

          {/* Visual */}
          <div className="flex-1 flex items-center justify-center px-8 pt-20 pb-8">
            <div className="w-full max-w-xs rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
                <span className="w-2 h-2 rounded-full bg-white/30" />
                <span className="w-2 h-2 rounded-full bg-white/30" />
                <span className="w-2 h-2 rounded-full bg-white/30" />
                <span className="ml-2 text-[10px] text-white/40 font-mono">mybrand.solarsas.com</span>
              </div>
              <div className="p-5">
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">New Lead</p>
                <p className="text-white font-bold text-base mb-4">Bola Adeyemi</p>
                {[
                  { label: 'System Size', val: '5.2 kW' },
                  { label: 'WhatsApp', val: '+234 801 234 5678' },
                  { label: 'Est. Cost', val: '₦2.6M' },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between py-2 border-b border-white/10 last:border-0">
                    <span className="text-white/40 text-xs">{r.label}</span>
                    <span className="text-white text-xs font-semibold">{r.val}</span>
                  </div>
                ))}
                <button className="w-full mt-4 bg-white text-[#0061FE] font-bold text-xs py-2.5 rounded-lg">
                  Message on WhatsApp →
                </button>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="px-8 pb-6">
            <h2 className="text-white text-3xl font-bold leading-tight tracking-tight mb-1">{slides[slide].headline}</h2>
            <p className="text-white/60 text-sm">{slides[slide].sub}</p>
          </div>

          {/* Nav */}
          <div className="flex items-center gap-4 px-8 pb-8">
            <button
              onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)}
              className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
            <div className="flex items-center gap-2 flex-1 justify-center">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)}
                  className={`rounded-full transition-all duration-300 ${i === slide ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/30'}`}
                />
              ))}
            </div>
            <button
              onClick={() => setSlide((s) => (s + 1) % slides.length)}
              className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
