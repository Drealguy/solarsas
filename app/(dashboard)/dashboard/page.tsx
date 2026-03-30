'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ActivateBanner from '@/components/ActivateBanner';
import { useActivation } from '@/components/ActivationContext';
import { getLeads, getConfig, formatNaira, getUnreadLeadCount, markNotifsRead, getUnreadChatCount, type Lead } from '@/lib/calcStore';

function timeAgo(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return 'Just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function StatCard({
  label, value, sub, icon, trend, locked,
}: {
  label: string; value: string; sub: string;
  icon: React.ReactNode;
  trend?: { label: string; up: boolean };
  locked?: boolean;
}) {
  return (
    <div className={`relative bg-white border border-gray-100 rounded-2xl p-5 overflow-hidden ${locked ? 'select-none' : ''}`}>
      {locked && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center rounded-2xl z-10">
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
      )}
      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          {icon}
        </div>
        {trend && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
            trend.up ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}>
            {trend.up ? '↑' : '↓'} {trend.label}
          </span>
        )}
      </div>
      {/* Value */}
      <p className="text-xs font-semibold text-neutral mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">{value}</p>
      <p className="text-xs text-neutral/70">{sub}</p>
    </div>
  );
}

// Activity item avatar colors (cycle through)
const AVATAR_COLORS = [
  'bg-blue-100 text-blue-600',
  'bg-purple-100 text-purple-600',
  'bg-green-100 text-green-600',
  'bg-orange-100 text-orange-600',
];

export default function DashboardHome() {
  const { isActive } = useActivation();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [copied, setCopied] = useState(false);
  const [businessName, setBusinessName] = useState('Solar Brand');
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const [calcConfig, setCalcConfig] = useState<{
    published: boolean; slug: string; pricePerKW: number;
  } | null>(null);

  useEffect(() => {
    const fresh = getLeads();
    setLeads(fresh);
    setUnreadCount(getUnreadLeadCount() + getUnreadChatCount());
    const cfg = getConfig();
    setBusinessName(cfg.businessName || 'Solar Brand');
    setCalcConfig({ published: cfg.published, slug: cfg.slug, pricePerKW: cfg.pricePerKW });
  }, []);

  const totalPipeline = leads.reduce((s, l) => s + l.estimatedCost, 0);
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const closedLeads = leads.filter((l) => l.status === 'closed').length;

  // Close notif panel when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    if (showNotifs) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showNotifs]);

  function toggleNotifs() {
    if (!showNotifs) {
      markNotifsRead();
      setUnreadCount(0);
    }
    setShowNotifs((v) => !v);
  }

  const slug = calcConfig?.slug || 'yourbrand';
  const calcLink = `https://${slug}.solarsas.com`;

  function copyLink() {
    navigator.clipboard.writeText(calcLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // First word of business name for greeting
  const firstName = businessName.split(' ')[0];

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Top header bar ──────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 py-0 h-16 flex items-center justify-between gap-4 flex-shrink-0">
        {/* Left: greeting */}
        <div>
          <h1 className="text-base font-bold text-gray-900 leading-tight">
            Welcome Back, <span className="text-primary">{firstName}</span>
          </h1>
          <p className="text-xs text-neutral">Here&apos;s what&apos;s happening with your solar business today.</p>
        </div>

        {/* Right: CTA + user */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={copyLink}
            className="hidden sm:flex items-center gap-2.5 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
          >
            {copied ? (
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
            )}
            <div className="text-left">
              <p className="text-xs font-bold leading-none">{copied ? 'Copied!' : 'Copy Calculator Link'}</p>
              <p className="text-[10px] text-white/70 leading-none mt-0.5">{slug}.solarsas.com</p>
            </div>
          </button>

          {/* Notification bell + dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={toggleNotifs}
              className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-neutral hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -8 }}
                  animate={{ opacity: 1, scale: 1,    y: 0  }}
                  exit={{   opacity: 0, scale: 0.96, y: -8  }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 top-11 z-50 w-80 bg-white rounded-2xl shadow-2xl shadow-black/15 border border-gray-100 overflow-hidden"
                >
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                    <h3 className="text-sm font-black text-gray-900">Notifications</h3>
                    {leads.filter(l => l.status === 'new').length > 0 && (
                      <span className="text-[10px] font-bold text-primary bg-primary/8 px-2 py-0.5 rounded-full">
                        {leads.filter(l => l.status === 'new').length} new
                      </span>
                    )}
                  </div>

                  {/* Notification list */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {leads.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                          <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-gray-500">No notifications yet</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Leads will appear here when customers submit quotes</p>
                      </div>
                    ) : (
                      leads.slice(0, 8).map((lead) => (
                        <div key={lead.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                          {/* Avatar */}
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-primary font-black text-[11px]">
                              {lead.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{lead.name}</p>
                            <p className="text-[11px] text-gray-500 leading-snug">
                              Requested a <span className="font-semibold text-gray-700">{lead.systemKW.toFixed(1)} kW</span> system — {formatNaira(lead.estimatedCost)}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{timeAgo(lead.createdAt)}</p>
                          </div>
                          {/* Status dot */}
                          {lead.status === 'new' && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {leads.length > 0 && (
                    <div className="border-t border-gray-100 px-4 py-3">
                      <Link
                        href="/dashboard/leads"
                        onClick={() => setShowNotifs(false)}
                        className="block text-center text-xs font-bold text-primary hover:underline"
                      >
                        View all leads →
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User avatar + name */}
          <div className="flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-primary font-black text-xs">
                {businessName.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-gray-800 leading-tight truncate max-w-[120px]">{businessName}</p>
            </div>
            <svg className="w-4 h-4 text-neutral hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </header>

      {/* ── Page content ────────────────────────────────── */}
      <div className="flex-1 p-6 space-y-6">

        <ActivateBanner />

        {/* ── Stat cards ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Leads"
            value={leads.length.toString()}
            sub={newLeads > 0 ? `${newLeads} new, uncontacted` : 'No new leads'}
            locked={!isActive}
            trend={leads.length > 0 ? { label: `${newLeads} new`, up: true } : undefined}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            }
          />
          <StatCard
            label="Pipeline Value"
            value={totalPipeline > 0 ? formatNaira(totalPipeline) : '₦0'}
            sub={closedLeads > 0 ? `${closedLeads} deals closed` : 'No closed deals yet'}
            locked={!isActive}
            trend={closedLeads > 0 ? { label: `${closedLeads} closed`, up: true } : undefined}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
            }
          />
          <StatCard
            label="Calculator Status"
            value={calcConfig?.published ? 'Live' : 'Draft'}
            sub={calcConfig?.published ? 'Accepting customer leads' : 'Publish to go live'}
            trend={calcConfig?.published ? { label: 'Active', up: true } : undefined}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            }
          />
        </div>

        {/* ── Recent Activity ─────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-900">Recent Activity</h2>
            <span className="text-xs font-semibold text-neutral bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
              TODAY
            </span>
          </div>

          <div className={`${!isActive ? 'relative' : ''}`}>
            {!isActive && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-2 min-h-[200px]">
                <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                <p className="text-xs text-neutral font-medium">Activate to see leads</p>
              </div>
            )}

            {leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-500 mb-1">No activity yet</p>
                <p className="text-xs text-neutral max-w-[200px]">
                  {calcConfig?.published
                    ? 'Share your calculator link to start getting leads.'
                    : 'Publish your calculator to start receiving leads.'}
                </p>
                <Link
                  href="/dashboard/calculator"
                  className="mt-4 text-xs font-bold text-primary hover:underline"
                >
                  {calcConfig?.published ? 'Copy your link →' : 'Set up calculator →'}
                </Link>
              </div>
            ) : (
              <div>
                {leads.slice(0, 6).map((lead, i) => (
                  <Link
                    key={lead.id}
                    href="/dashboard/leads"
                    className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Colored avatar circle */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                      {lead.name[0].toUpperCase()}
                    </div>

                    {/* Activity text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-snug">
                        <span className="font-semibold">{lead.name}</span>
                        {' submitted a solar quote for '}
                        <span className="font-semibold text-primary">{lead.systemKW} kW system</span>
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <svg className="w-3 h-3 text-neutral/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span className="text-[11px] text-neutral/60">{timeAgo(lead.createdAt)}</span>
                        <span className="text-[11px] text-neutral/40 ml-1">· {formatNaira(lead.estimatedCost)}</span>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      lead.status === 'new' ? 'bg-primary/10 text-primary' :
                      lead.status === 'contacted' ? 'bg-tertiary/10 text-[#7A5800]' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {lead.status === 'new' ? 'New' : lead.status === 'contacted' ? 'Contacted' : 'Closed'}
                    </span>
                  </Link>
                ))}

                {/* View all link */}
                <div className="px-6 py-4">
                  <Link
                    href="/dashboard/leads"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    View all activity →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Quick actions ────────────────────────────────── */}
        {!calcConfig?.published && (
          <div className="bg-primary rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-white font-bold text-sm mb-0.5">Your calculator isn&apos;t live yet</p>
              <p className="text-white/70 text-xs">Publish it so customers can get quotes and you can receive leads.</p>
            </div>
            <Link
              href="/dashboard/calculator"
              className="flex-shrink-0 bg-white text-primary font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Set Up Now →
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
