'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

// ─── Animation helpers ─────────────────────────────────────────────────────────

type EaseTuple = [number, number, number, number];
const EASE: EaseTuple = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay } },
});

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5, ease: EASE, delay } },
});

function useSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return { ref, inView };
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────

const faqs = [
  { q: 'Do I need to pay to create an account?', a: 'No. You can register, build your entire dashboard, and configure your brand for free. You only pay when you are ready to go live and activate your calculator link.' },
  { q: 'How do customers use the calculator?', a: 'Customers visit your branded link (e.g. yourbrand.solarsas.com) and use simple +/− buttons to add appliances. No typing. Before seeing their quote, they submit their name and WhatsApp number.' },
  { q: 'How do I receive leads?', a: "Every lead appears instantly in your dashboard with the customer's name, WhatsApp number, appliance list, and estimated system size. You also get a direct WhatsApp link to follow up immediately." },
  { q: 'Can I use my own logo and brand colors?', a: 'Yes. In the Settings page you can upload your logo, set your business name, and customize your hero text. Your customers will only see your brand — never Solarsas.' },
  { q: 'Is the solar sizing accurate for Nigeria?', a: 'Yes. We use NASA POWER peak sun hours data for all 36 states + FCT, apply AC duty cycle corrections (65%), refrigerator cycling (45%), and temperature derating per climate zone — the same methodology used by professional solar engineers.' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-sm font-semibold text-gray-900">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="overflow-hidden"
      >
        <p className="text-sm text-gray-500 leading-relaxed pb-5">{a}</p>
      </motion.div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const hero    = useSection();
  const features = useSection();
  const howItWorks = useSection();
  const faq     = useSection();

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased overflow-x-hidden">

      {/* ── Announcement bar ─────────────────────────────────────────────── */}
      <div className="bg-primary text-white text-center text-xs font-medium py-2.5 px-4">
        🚀 Solarsas is now live — get your free calculator link today.{' '}
        <Link href="/register" className="underline font-bold hover:opacity-90">
          Start free →
        </Link>
      </div>

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <span className="font-extrabold text-gray-900 text-base tracking-tight">Solarsas</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-500">
            <Link href="#features"     className="hover:text-gray-900 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</Link>
            <Link href="#pricing"      className="hover:text-gray-900 transition-colors">Pricing</Link>
            <Link href="#faq"          className="hover:text-gray-900 transition-colors">FAQ</Link>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-bold bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors">
              Get Started Free
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/register" className="text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-lg">
              Get Started
            </Link>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              {mobileNavOpen
                ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <rect x="3" y="3" width="18" height="18" rx="2.5" />
                    <path strokeLinecap="round" d="M9 3v18" />
                  </svg>
                )
              }
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="overflow-hidden border-t border-gray-100 md:hidden bg-white"
            >
              <div className="px-5 py-4 flex flex-col gap-1">
                {[
                  { label: 'Features',     href: '#features'     },
                  { label: 'How It Works', href: '#how-it-works' },
                  { label: 'Pricing',      href: '#pricing'      },
                  { label: 'FAQ',          href: '#faq'          },
                ].map((item) => (
                  <Link key={item.label} href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="text-sm font-medium text-gray-700 py-2.5 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-gray-100 mt-2 pt-3">
                  <Link href="/login" onClick={() => setMobileNavOpen(false)}
                    className="block text-sm font-medium text-gray-500 py-2 hover:text-gray-900"
                  >
                    Log In
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-5 pt-16 sm:pt-20 pb-0" ref={hero.ref}>

        {/* Badge */}
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          animate={hero.inView ? 'show' : 'hidden'}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 text-primary text-xs font-bold px-3.5 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Built for Nigerian Solar Installers
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp(0.08)}
          initial="hidden"
          animate={hero.inView ? 'show' : 'hidden'}
          className="text-center text-4xl sm:text-5xl lg:text-[64px] font-black tracking-tight leading-[1.08] text-gray-900 mb-5"
        >
          Turn every enquiry into
          <br className="hidden sm:block" />
          <span className="text-primary"> a qualified lead.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp(0.15)}
          initial="hidden"
          animate={hero.inView ? 'show' : 'hidden'}
          className="text-center text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-8"
        >
          Give your brand a solar calculator link. Customers size their own system.
          You get a WhatsApp lead in under 2 minutes — no calls, no back-and-forth.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp(0.22)}
          initial="hidden"
          animate={hero.inView ? 'show' : 'hidden'}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4"
        >
          <Link
            href="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            Get Started For Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="#how-it-works"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            See How It Works
          </Link>
        </motion.div>

        {/* Trust micro-copy */}
        <motion.p
          variants={fadeUp(0.28)}
          initial="hidden"
          animate={hero.inView ? 'show' : 'hidden'}
          className="text-center text-xs text-gray-400 mb-12 flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          No credit card required &nbsp;·&nbsp; Free forever plan &nbsp;·&nbsp; Setup in 5 minutes
        </motion.p>

        {/* ── Image Mosaic ──────────────────────────────────────────────── */}
        <motion.div
          variants={fadeIn(0.35)}
          initial="hidden"
          animate={hero.inView ? 'show' : 'hidden'}
          className="relative"
        >
          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">

            {/* Left — tall image */}
            <div className="col-span-1 lg:col-span-2 relative">
              <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 lg:h-[460px]">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
                  alt="Solar installer"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Floating lead card */}
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={hero.inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.7, duration: 0.5, ease: EASE }}
                className="absolute bottom-5 left-3 right-3 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 p-3.5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">New Lead</p>
                  <span className="ml-auto text-[10px] text-gray-400">Just now</span>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-0.5">Bola Adeyemi</p>
                <p className="text-xs text-gray-500">3.5 kW system · <span className="text-primary font-semibold">₦1,750,000</span></p>
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100">
                  <div className="flex-1 bg-green-500 text-white text-[10px] font-bold py-1.5 rounded-lg text-center">
                    WhatsApp →
                  </div>
                  <div className="flex-1 bg-gray-50 text-gray-600 text-[10px] font-bold py-1.5 rounded-lg text-center border border-gray-100">
                    View Details
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right — stacked two images */}
            <div className="col-span-1 lg:col-span-3 flex flex-col gap-3 sm:gap-4">

              {/* Top right: solar installation photo */}
              <div className="relative rounded-2xl overflow-hidden h-36 sm:h-48 lg:h-56">
                <Image
                  src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80"
                  alt="Solar panel installation"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />

                {/* Floating pipeline card */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={hero.inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.85, duration: 0.5, ease: EASE }}
                  className="absolute top-3 right-3 bg-white rounded-xl shadow-lg shadow-black/10 px-3.5 py-2.5 border border-gray-100"
                >
                  <p className="text-[10px] text-gray-400 font-semibold mb-0.5">Total Pipeline</p>
                  <p className="text-base font-black text-gray-900">₦24.6M</p>
                  <p className="text-[10px] text-green-600 font-bold flex items-center gap-0.5">↑ 18% this month</p>
                </motion.div>
              </div>

              {/* Bottom right: team / people photo */}
              <div className="relative rounded-2xl overflow-hidden h-36 sm:h-48 lg:h-[188px]">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                  alt="Solar team"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

                {/* Floating stats bar */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={hero.inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.0, duration: 0.5, ease: EASE }}
                  className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg px-4 py-2.5 flex items-center justify-between"
                >
                  <div className="text-center">
                    <p className="text-base font-black text-gray-900">247</p>
                    <p className="text-[10px] text-gray-400 font-medium">Leads</p>
                  </div>
                  <div className="w-px h-6 bg-gray-100" />
                  <div className="text-center">
                    <p className="text-base font-black text-primary">89%</p>
                    <p className="text-[10px] text-gray-400 font-medium">Conversion</p>
                  </div>
                  <div className="w-px h-6 bg-gray-100" />
                  <div className="text-center">
                    <p className="text-base font-black text-gray-900">2 min</p>
                    <p className="text-[10px] text-gray-400 font-medium">To Quote</p>
                  </div>
                  <div className="w-px h-6 bg-gray-100" />
                  <div className="text-center">
                    <p className="text-base font-black text-green-600">150+</p>
                    <p className="text-[10px] text-gray-400 font-medium">Installers</p>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Trust / logo strip ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 pt-16 pb-4">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
          Trusted by solar brands across Nigeria
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-40">
          {['Sunvolt Energy', 'Brightpath Solar', 'GridFree NG', 'Solarize Africa', 'PowerUp Systems', 'EcoBright'].map((name) => (
            <span key={name} className="text-sm font-bold text-gray-500 tracking-tight">{name}</span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── FEATURES SECTION (3-col) ─────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="features" className="max-w-6xl mx-auto px-5 py-20 sm:py-28" ref={features.ref}>
        <motion.div variants={fadeUp(0)} initial="hidden" animate={features.inView ? 'show' : 'hidden'} className="text-center mb-14">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Why Solarsas</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 mb-4">
            Everything you need to close <br className="hidden sm:block" />more solar deals.
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Stop losing leads in WhatsApp threads. Solarsas gives you a professional sales system built specifically for the Nigerian solar market.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
              ),
              title: 'Your branded calculator link',
              desc:  'Customers visit yourbrand.solarsas.com — fully white-labeled with your business name, logo, and pricing.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              ),
              title: 'Accurate Nigerian sizing',
              desc:  'State-specific peak sun hours (NASA data), AC duty cycles, temperature derating. Kano ≠ Lagos — we know the difference.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              ),
              title: 'Instant WhatsApp leads',
              desc:  'Every submission lands in your dashboard with name, phone, full appliance list, and a one-tap WhatsApp follow-up button.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              ),
              title: 'Full appliance catalog',
              desc:  'All 38 Nigerian household appliances — ACs, fridges, borehole pumps, DSTV — with real-world wattage defaults your customers can adjust.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              ),
              title: 'Battery sizing included',
              desc:  'Customers pick tubular or lithium, set their backup hours — the system calculates exact battery count using DoD-corrected math.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
              ),
              title: 'Pipeline & CRM built in',
              desc:  'Track every lead from New → Contacted → Closed. See your total pipeline value, close rate, and average system size at a glance.',
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp(i * 0.07)}
              initial="hidden"
              animate={features.inView ? 'show' : 'hidden'}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-primary/20 hover:bg-blue-50/30 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-gray-50 border-y border-gray-100 py-20 sm:py-28" ref={howItWorks.ref}>
        <div className="max-w-6xl mx-auto px-5">
          <motion.div variants={fadeUp(0)} initial="hidden" animate={howItWorks.inView ? 'show' : 'hidden'} className="text-center mb-14">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 mb-4">Up and running in 5 minutes.</h2>
            <p className="text-gray-500 text-base max-w-md mx-auto">No developers, no integrations, no setup fees.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Create your account', desc: 'Sign up free. Set your business name, pricing per kW, and WhatsApp contact number.' },
              { step: '02', title: 'Publish your calculator', desc: 'Toggle your calculator live — your link goes live instantly at yourbrand.solarsas.com.' },
              { step: '03', title: 'Share your link', desc: 'Send it on WhatsApp, put it on your Instagram bio, print it on your business card.' },
              { step: '04', title: 'Receive qualified leads', desc: "Customer submits their load profile and WhatsApp number. You get a lead card. Call them." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp(i * 0.1)}
                initial="hidden"
                animate={howItWorks.inView ? 'show' : 'hidden'}
                className="relative"
              >
                {i < 3 && (
                  <div className="hidden lg:block absolute top-5 left-full w-full h-px border-t-2 border-dashed border-gray-200 z-0 -translate-x-3" />
                )}
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-primary text-white font-black text-sm flex items-center justify-center mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="max-w-6xl mx-auto px-5 py-20 sm:py-28">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 mb-4">
            Choose the plan that fits your business.
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">Start free. Upgrade when you&apos;re ready to go live.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            {
              name: 'Starter',
              price: 'Free',
              period: 'forever',
              desc: 'Perfect for getting set up and testing your calculator.',
              features: ['1 branded calculator', 'Full appliance catalog', 'Accurate Nigerian sizing', '5 leads per month', 'Basic dashboard'],
              cta: 'Get Started Free',
              href: '/register',
              highlighted: false,
            },
            {
              name: 'Pro',
              price: '₦15,000',
              period: 'per month',
              desc: 'For active installers who close deals every week.',
              features: ['Everything in Starter', 'Unlimited leads', 'WhatsApp follow-up links', 'Pipeline CRM', 'Wattage overrides', 'Priority support'],
              cta: 'Start Pro',
              href: '/register',
              highlighted: true,
            },
            {
              name: 'Business',
              price: '₦35,000',
              period: 'per month',
              desc: 'For teams managing multiple brands or locations.',
              features: ['Everything in Pro', 'Up to 5 calculator brands', 'Team member access', 'Advanced analytics', 'Custom domain', 'Dedicated onboarding'],
              cta: 'Contact Sales',
              href: '/register',
              highlighted: false,
              comingSoon: true,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 flex flex-col relative ${
                plan.highlighted
                  ? 'bg-primary border-primary text-white shadow-2xl shadow-primary/30 scale-105'
                  : 'bg-white border-gray-100'
              }`}
            >
              {'comingSoon' in plan && plan.comingSoon && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1.5 bg-[#FFB800] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-[#FFB800]/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Coming Soon
                  </span>
                </div>
              )}
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${plan.highlighted ? 'text-white/70' : 'text-primary'}`}>
                {plan.name}
              </p>
              <div className="flex items-end gap-1.5 mb-1">
                <p className={`text-3xl font-black ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.price}</p>
                <p className={`text-sm pb-0.5 ${plan.highlighted ? 'text-white/60' : 'text-gray-400'}`}>/{plan.period}</p>
              </div>
              <p className={`text-xs mb-5 ${plan.highlighted ? 'text-white/70' : 'text-gray-500'}`}>{plan.desc}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs">
                    <svg className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-white/70' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className={plan.highlighted ? 'text-white/90' : 'text-gray-600'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center text-sm font-bold py-3 rounded-xl transition-colors ${
                  plan.highlighted
                    ? 'bg-white text-primary hover:bg-gray-50'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="bg-gray-50 border-t border-gray-100 py-20 sm:py-28" ref={faq.ref}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div variants={fadeUp(0)} initial="hidden" animate={faq.inView ? 'show' : 'hidden'}>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">FAQ</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 mb-4">
                Got questions?<br />We&apos;ve got answers.
              </h2>
              <p className="text-gray-500 text-base mb-8 max-w-sm">
                Everything you need to know about Solarsas. Can&apos;t find what you&apos;re looking for? Chat with us on WhatsApp.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-primary text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Start for free →
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp(0.12)}
              initial="hidden"
              animate={faq.inView ? 'show' : 'hidden'}
              className="bg-white rounded-2xl border border-gray-100 divide-y-0 px-6"
            >
              {faqs.map((item) => (
                <FAQItem key={item.q} {...item} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-primary py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            The modern way to run<br />your solar business.
          </h2>
          <p className="text-white/70 text-base mb-8 max-w-md mx-auto">
            Join 150+ Nigerian solar installers who use Solarsas to quote faster, follow up smarter, and close more deals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-white text-primary font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Request a Demo →
            </Link>
            <p className="text-white/50 text-xs">No credit card required · Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <span className="font-extrabold text-white text-sm">Solarsas</span>
              </div>
              <p className="text-xs leading-relaxed">Solar CRM for Nigerian installers. Get leads, close deals.</p>
            </div>
            {/* Links */}
            {[
              { heading: 'Product',   links: ['Features', 'Pricing', 'How It Works'] },
              { heading: 'Resources', links: ['Blog', 'Case Studies', 'Contact Us'] },
              { heading: 'Get in',    links: ['Register', 'Log In', 'WhatsApp'] },
            ].map((col) => (
              <div key={col.heading}>
                <p className="text-xs font-bold text-white uppercase tracking-widest mb-3">{col.heading}</p>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="text-xs hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs">© 2026 Solarsas. Built for Nigeria.</p>
            <p className="text-xs">Privacy Policy · Error 404</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
