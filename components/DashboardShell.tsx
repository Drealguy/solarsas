'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import PaywallModal from './PaywallModal';
import { ActivationProvider, useActivation } from './ActivationContext';
import { getConfig, getUnreadChatCount, getLeads } from '@/lib/calcStore';

const navItems = [
  {
    label: 'Overview', href: '/dashboard', locked: false,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: 'Calculator', href: '/dashboard/calculator', locked: false,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm2.25-4.5h.008v.008H10.5v-.008Zm0 2.25h.008v.008H10.5V13.5Zm0 2.25h.008v.008H10.5v-.008Zm2.25-4.5h.008v.008H12.75v-.008Zm0 2.25h.008v.008H12.75V13.5Zm0 2.25h.008v.008H12.75v-.008Zm2.25-4.5h.008v.008H15v-.008Zm0 2.25h.008v.008H15V13.5Zm0 2.25h.008v.008H15v-.008ZM4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
  },
  {
    label: 'Leads', href: '/dashboard/leads', locked: true,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    label: 'Messages', href: '/dashboard/messages', locked: false,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
  },
  {
    label: 'Settings', href: '/dashboard/settings', locked: false,
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
];

function SidebarContent({ onPaywall, onClose, newLeadCount = 0, unreadChatCount = 0 }: {
  onPaywall: () => void;
  onClose?: () => void;
  newLeadCount?: number;
  unreadChatCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isActive } = useActivation();
  const [businessName, setBusinessName] = useState('Solar Brand');
  const [slug, setSlug] = useState('mybrand');
  const [published, setPublished] = useState(false);

  useEffect(() => {
    const cfg = getConfig();
    if (cfg.businessName) setBusinessName(cfg.businessName);
    if (cfg.slug) setSlug(cfg.slug);
    setPublished(cfg.published);
  }, []);

  function handleLogout() {
    onClose?.();
    router.push('/login');
  }

  const initials = businessName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">

      {/* ── Logo ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="font-extrabold text-gray-900 text-base tracking-tight">Solarsas</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-neutral lg:hidden">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ── User profile section ──────────────────────── */}
      <div className="px-6 py-6 border-b border-gray-100 flex-shrink-0">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-3">
          <span className="text-primary font-black text-lg">{initials}</span>
        </div>
        <p className="font-bold text-gray-900 text-sm leading-tight">{businessName}</p>
        <p className="text-xs text-neutral mt-0.5">Solar Installer</p>
        {/* Live/Draft badge */}
        <div className="mt-3">
          {published ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Calculator Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#7A5800] bg-tertiary/10 px-2.5 py-1 rounded-full border border-tertiary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
              Not Published
            </span>
          )}
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────── */}
      <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isLocked = item.locked && !isActive;
          const isActive_ = pathname === item.href;
          const showBadge = item.href === '/dashboard/leads' && newLeadCount > 0;
          const chatBadge = item.href === '/dashboard/messages' && unreadChatCount > 0;

          if (isLocked) {
            return (
              <button
                key={item.label}
                onClick={() => { onPaywall(); onClose?.(); }}
                className="group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-neutral/50 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="flex items-center gap-3">
                  <span className="text-neutral/30">{item.icon}</span>
                  {item.label}
                </span>
                <svg className="w-3.5 h-3.5 text-neutral/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive_
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={isActive_ ? 'text-primary' : 'text-neutral'}>{item.icon}</span>
                {item.label}
              </span>
              {showBadge && (
                <span className="text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {newLeadCount}
                </span>
              )}
              {chatBadge && (
                <span className="text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadChatCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ───────────────────────────────────── */}
      <div className="px-4 py-4 border-t border-gray-100 flex-shrink-0 space-y-1">
        {!isActive && (
          <button
            onClick={onPaywall}
            className="w-full bg-primary text-white font-bold text-xs py-2.5 px-3 rounded-xl hover:bg-primary/90 transition-colors mb-2"
          >
            ⚡ Activate Dashboard
          </button>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
          </svg>
          Log out
        </button>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isActive } = useActivation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [unreadChats, setUnreadChats] = useState(0);
  const [newLeads, setNewLeads] = useState(0);

  useEffect(() => {
    function refresh() {
      setUnreadChats(getUnreadChatCount());
      setNewLeads(getLeads().filter(l => l.status === 'new').length);
    }
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 sticky top-0 h-screen">
          <SidebarContent onPaywall={() => setPaywallOpen(true)} newLeadCount={newLeads} unreadChatCount={unreadChats} />
        </aside>

        {/* Mobile backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile drawer */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent
            onPaywall={() => { setPaywallOpen(true); setMobileOpen(false); }}
            onClose={() => setMobileOpen(false)}
            newLeadCount={newLeads}
            unreadChatCount={unreadChats}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen">

          {/* Mobile top bar */}
          <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-gray-100 sticky top-0 z-30 flex-shrink-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-1 rounded-lg hover:bg-gray-100 text-neutral"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <span className="font-extrabold text-gray-900 text-sm">Solarsas</span>
            </div>
            {!isActive ? (
              <button
                onClick={() => setPaywallOpen(true)}
                className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg"
              >
                Activate
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center"
                title="Log out"
              >
                A
              </button>
            )}
          </header>

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>

      <PaywallModal isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </>
  );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <ActivationProvider>
      <Shell>{children}</Shell>
    </ActivationProvider>
  );
}
