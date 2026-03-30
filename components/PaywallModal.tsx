'use client';

import { useEffect } from 'react';
import { useActivation } from './ActivationContext';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const { activate } = useActivation();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  function handleActivate() {
    activate();
    onClose();
  }

  const features = [
    'Live calculator at yourbrand.solarsas.com',
    'Full appliance & pricing configuration',
    'Real-time lead capture with contact details',
    'WhatsApp handoff link for every lead',
    'Custom logo, hero text & brand colors',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="relative bg-gradient-to-br from-[#0061FE] to-[#004FD4] px-6 sm:px-8 pt-8 pb-10 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Drag handle on mobile */}
          <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-6 sm:hidden" />
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center mb-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-1">Activate Your Dashboard</h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Go live and start receiving qualified leads through your branded calculator.
          </p>
        </div>
        <div className="px-6 sm:px-8 py-6">
          <ul className="space-y-3 mb-6">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                <div className="mt-0.5 w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-[#0061FE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                {f}
              </li>
            ))}
          </ul>
          <div className="flex items-end gap-1 mb-5 px-4 py-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">₦15,000</span>
            <span className="text-gray-400 text-sm mb-1">/month</span>
          </div>
          <button
            onClick={handleActivate}
            className="w-full bg-[#0061FE] text-white font-bold py-3.5 rounded-xl hover:bg-blue-600 transition-colors text-sm"
          >
            Activate Now — Pay with Paystack
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">Secured by Paystack · Cancel anytime</p>
        </div>
      </div>
    </div>
  );
}
