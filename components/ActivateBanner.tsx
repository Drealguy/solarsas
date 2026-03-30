'use client';

import { useState } from 'react';
import PaywallModal from './PaywallModal';
import { useActivation } from './ActivationContext';

export default function ActivateBanner() {
  const { isActive } = useActivation();
  const [paywallOpen, setPaywallOpen] = useState(false);

  if (isActive) return null;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-tertiary/10 border border-tertiary/25 rounded-xl px-4 py-4 mb-6">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-tertiary/20 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
            <svg className="w-4 h-4 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Your dashboard is ready — activate to go live</p>
            <p className="text-xs text-neutral mt-0.5">Calculator link, leads CRM, and pricing tools unlock instantly.</p>
          </div>
        </div>
        <button
          onClick={() => setPaywallOpen(true)}
          className="w-full sm:w-auto flex-shrink-0 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Activate Now
        </button>
      </div>
      <PaywallModal isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </>
  );
}
