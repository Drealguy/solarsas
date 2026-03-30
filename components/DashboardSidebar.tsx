'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PaywallModal from './PaywallModal';

// TODO: Replace with real Supabase session check (tenant.is_active)
const IS_ACTIVE = false;
const BRAND_SLUG = 'mybrand';

const navItems = [
  {
    label: 'Home',
    href: '/dashboard',
    locked: false,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: 'Calculator',
    href: '/dashboard/calculator',
    locked: true,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm2.25-4.5h.008v.008H10.5v-.008Zm0 2.25h.008v.008H10.5V13.5Zm0 2.25h.008v.008H10.5v-.008Zm2.25-4.5h.008v.008H12.75v-.008Zm0 2.25h.008v.008H12.75V13.5Zm0 2.25h.008v.008H12.75v-.008Zm2.25-4.5h.008v.008H15v-.008Zm0 2.25h.008v.008H15V13.5Zm0 2.25h.008v.008H15v-.008ZM4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
  },
  {
    label: 'Leads',
    href: '/dashboard/leads',
    locked: true,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    locked: false,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [paywallOpen, setPaywallOpen] = useState(false);

  return (
    <>
      <aside className="w-56 flex-shrink-0 border-r border-gray-100 bg-white flex flex-col min-h-screen sticky top-0">
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 h-16 border-b border-gray-100">
          <div className="w-7 h-7 rounded-lg bg-[#0061FE] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="font-black text-gray-900 tracking-tight">Solarsas</span>
        </div>

        {/* Brand link chip */}
        <div className="mx-3 mt-3 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">Your link</p>
          <p className="text-xs font-bold text-gray-700 truncate">{BRAND_SLUG}.solarsas.com</p>
          {!IS_ACTIVE && (
            <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold uppercase tracking-wide text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">
              <span className="w-1 h-1 rounded-full bg-amber-500" />
              Not live
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isLocked = item.locked && !IS_ACTIVE;
            const isActive = pathname === item.href;

            if (isLocked) {
              return (
                <button
                  key={item.label}
                  onClick={() => setPaywallOpen(true)}
                  className="group w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-gray-300 group-hover:text-gray-400 transition-colors">{item.icon}</span>
                    {item.label}
                  </span>
                  <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0061FE] text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom CTA */}
        <div className="p-3 border-t border-gray-100">
          {!IS_ACTIVE ? (
            <button
              onClick={() => setPaywallOpen(true)}
              className="w-full bg-[#0061FE] text-white font-bold text-xs py-2.5 px-3 rounded-lg hover:bg-blue-600 transition-colors tracking-wide"
            >
              ⚡ Activate Dashboard
            </button>
          ) : (
            <div className="flex items-center gap-2.5 px-1 py-1">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0061FE] text-xs font-black flex items-center justify-center flex-shrink-0">A</div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">Adewale Solar</p>
                <p className="text-[10px] text-gray-400 truncate">admin@brand.com</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      <PaywallModal isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </>
  );
}
