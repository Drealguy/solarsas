'use client';

import { useState, useEffect, useRef } from 'react';
import {
  getConfig, addLead, formatNaira, formatNairaFull,
  CATALOG_APPLIANCES, CATEGORY_LABELS, CATEGORY_ORDER,
  type CalcConfig, type Lead, type ApplianceCategory,
} from '@/lib/calcStore';
import { calcSystemAccurate, STATE_OPTIONS, DEFAULT_STATE_KEY } from '@/lib/solarData';
import { calculateBatteryRequirements, type BatteryPreference } from '@/lib/batteryCalc';
import CustomerChat from '@/components/CustomerChat';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Selection {
  qty: number;
  hours: number;
}

interface CustomAppliance {
  id: string;
  name: string;
  watts: number;
  qty: number;
  hours: number;
}

// ─── Category icons ───────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<ApplianceCategory, React.ReactNode> = {
  lighting: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  cooling: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  ),
  kitchen: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
    </svg>
  ),
  entertainment: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  ),
  office: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
    </svg>
  ),
  water: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.444 5.332-6.667 9.332-6.667 12a6.667 6.667 0 1 0 13.334 0C18.667 12.332 16.444 8.332 12 3Z" />
    </svg>
  ),
  other: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  ),
};

// ─── Stepper component ────────────────────────────────────────────────────────

function Stepper({
  value, min, max, step = 1, onChange, formatVal,
  size = 'md',
}: {
  value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void;
  formatVal?: (v: number) => string;
  size?: 'sm' | 'md';
}) {
  const btnCls = size === 'sm'
    ? 'w-7 h-7 text-base'
    : 'w-8 h-8 text-lg';

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, Math.round((value - step) * 10) / 10))}
        disabled={value <= min}
        className={`${btnCls} rounded-full border border-gray-200 bg-white text-gray-500 flex items-center justify-center leading-none disabled:opacity-30 hover:border-gray-300 active:scale-95 transition-all`}
      >−</button>
      <span className="min-w-[2.5rem] text-center text-sm font-black text-[#0061FE]">
        {formatVal ? formatVal(value) : value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, Math.round((value + step) * 10) / 10))}
        disabled={value >= max}
        className={`${btnCls} rounded-full bg-[#0061FE] text-white flex items-center justify-center leading-none disabled:opacity-40 hover:bg-blue-600 active:scale-95 transition-all`}
      >+</button>
    </div>
  );
}

// ─── Custom appliance modal ───────────────────────────────────────────────────

function CustomApplianceModal({ onAdd, onClose }: {
  onAdd: (name: string, watts: number, qty: number, hours: number) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [watts, setWatts] = useState('');
  const [qty, setQty] = useState(1);
  const [hours, setHours] = useState(4);

  function handleAdd() {
    const w = parseInt(watts);
    if (!name.trim() || !w || w <= 0) return;
    onAdd(name.trim(), w, qty, hours);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-bold text-gray-900 text-sm">Add Custom Appliance</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Appliance name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Generator (inverter mode)"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0061FE] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Wattage (W)</label>
            <input
              value={watts}
              onChange={(e) => setWatts(e.target.value)}
              type="number"
              min={1}
              placeholder="e.g. 800"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0061FE] transition-all"
            />
            <p className="text-[11px] text-gray-400 mt-1">Check the label on the appliance or user manual.</p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Quantity</p>
              <Stepper value={qty} min={1} max={20} onChange={setQty} size="sm" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Hours / day</p>
              <Stepper value={hours} min={0.5} max={24} step={0.5} onChange={setHours}
                formatVal={(v) => `${v}h`} size="sm" />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!name.trim() || !parseInt(watts)}
            className="w-full bg-[#0061FE] text-white font-bold text-sm py-3 rounded-xl hover:bg-blue-600 disabled:opacity-40 transition-colors"
          >
            Add to my list
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Lead form ────────────────────────────────────────────────────────────────

function LeadForm({ onSubmit }: { onSubmit: (name: string, whatsapp: string) => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    onSubmit(name.trim(), phone.trim());
  }

  function handlePhoneChange(raw: string) {
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('0')) setPhone('+234' + digits.slice(1));
    else if (digits.startsWith('234')) setPhone('+' + digits);
    else setPhone(raw);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. Bola Adeyemi"
          className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0061FE] focus:bg-white transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">WhatsApp Number</label>
        <input
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          required
          type="tel"
          placeholder="+234 801 234 5678"
          className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0061FE] focus:bg-white transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#0061FE] text-white font-bold text-sm py-3.5 rounded-xl hover:bg-blue-600 disabled:opacity-60 transition-colors"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Getting your quote…
          </>
        ) : 'Get My Full Quote →'}
      </button>
      <p className="text-[11px] text-gray-400 text-center">
        We&apos;ll only use this to send you your quote via WhatsApp.
      </p>
    </form>
  );
}

// ─── Thank-you screen ─────────────────────────────────────────────────────────

function ThankYou({ name, panelKw, inverterKw, batteryCount, batteryLabel, cost, contactWhatsapp, businessName }: {
  name: string; panelKw: number; inverterKw: number;
  batteryCount: number; batteryLabel: string;
  cost: number; contactWhatsapp: string; businessName: string;
}) {
  const systemKW = Math.max(panelKw, inverterKw);
  const waMsg = encodeURIComponent(
    `Hi, I used your solar calculator and got a quote: ${panelKw} kW panels, ${inverterKw} kW inverter${batteryCount > 0 ? `, ${batteryCount}× battery` : ''}. Estimated cost: ${formatNaira(cost)}. I'd like to discuss further.`
  );
  const waNum = contactWhatsapp.replace(/\D/g, '');

  return (
    <div className="text-center py-6 px-2">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <h2 className="text-xl font-black text-gray-900 mb-1">Done, {name.split(' ')[0]}!</h2>
      <p className="text-sm text-gray-500 mb-6">
        Your quote has been sent. {businessName} will contact you on WhatsApp shortly.
      </p>

      {/* System summary */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6 text-left">
        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-4">Your System</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-blue-400 mb-0.5">Solar Panels</p>
            <p className="text-xl font-black text-[#0061FE]">{panelKw} <span className="text-sm">kW</span></p>
          </div>
          <div>
            <p className="text-[10px] text-blue-400 mb-0.5">Inverter</p>
            <p className="text-xl font-black text-[#0061FE]">{inverterKw} <span className="text-sm">kW</span></p>
          </div>
          {batteryCount > 0 && (
            <div className="col-span-2">
              <p className="text-[10px] text-blue-400 mb-0.5">Battery Backup</p>
              <p className="text-base font-bold text-gray-800">{batteryCount}× {batteryLabel}</p>
            </div>
          )}
          <div className="col-span-2 pt-3 border-t border-blue-100">
            <p className="text-[10px] text-blue-400 mb-0.5">Estimated Cost</p>
            <p className="text-2xl font-black text-gray-900">{formatNairaFull(cost)}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Final price confirmed during site survey</p>
          </div>
        </div>
      </div>

      {waNum ? (
        <a
          href={`https://wa.me/${waNum}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-green-600 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.062.527 4.001 1.455 5.692L0 24l6.47-1.425A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.79 9.79 0 0 1-5.045-1.398l-.361-.215-3.843.846.866-3.736-.234-.38A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
          </svg>
          Chat with {businessName}
        </a>
      ) : (
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
          {businessName} will reach out to you via WhatsApp shortly.
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CustomerCalculatorPage() {
  const [config, setConfig] = useState<CalcConfig | null>(null);
  const [stateKey, setStateKey] = useState(DEFAULT_STATE_KEY);
  const [activeCategory, setActiveCategory] = useState<ApplianceCategory>('lighting');
  const [selections, setSelections] = useState<Record<string, Selection>>({});
  const [customAppliances, setCustomAppliances] = useState<CustomAppliance[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Battery section
  const [wantBattery, setWantBattery] = useState(false);
  const [batteryType, setBatteryType] = useState<BatteryPreference>('TUBULAR_12V_200AH');
  const [backupHours, setBackupHours] = useState(6);

  const [step, setStep] = useState<'calculator' | 'form' | 'done'>('calculator');
  const [submittedName, setSubmittedName] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setConfig(getConfig()); }, []);

  if (!config) return null;

  if (!config.published) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-tertiary/10 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Coming Soon</h1>
        <p className="text-gray-400 text-sm max-w-xs">This solar calculator is being set up. Check back soon!</p>
      </div>
    );
  }

  // ── Build unified appliance list for calculation ───────────────────────────
  // Apply installer's wattage overrides before calculation
  const overrides = config.wattageOverrides ?? {};

  const selectedPresets = CATALOG_APPLIANCES
    .filter((a) => selections[a.id]?.qty > 0)
    .map((a) => ({
      name: a.name,
      watts: overrides[a.id] ?? a.watts, // installer override takes precedence
      qty: selections[a.id].qty,
      hoursPerDay: selections[a.id].hours,
    }));

  const selectedCustom = customAppliances
    .filter((a) => a.qty > 0)
    .map((a) => ({ name: a.name, watts: a.watts, qty: a.qty, hoursPerDay: a.hours }));

  const allSelected = [...selectedPresets, ...selectedCustom];
  const hasSelections = allSelected.length > 0;

  // ── Solar sizing ─────────────────────────────────────────────────────────
  const sizing = hasSelections
    ? calcSystemAccurate({ appliances: allSelected, stateKey })
    : null;

  const panelKw    = sizing?.panelKw    ?? 0;
  const inverterKw = sizing?.inverterKw ?? 0;
  const systemKW   = sizing?.systemKw   ?? 0;
  const dailyKWh   = sizing?.dailyLoadKwh ?? 0;

  // ── Battery sizing ───────────────────────────────────────────────────────
  const peakLoadW = allSelected.reduce((s, a) => s + a.watts * a.qty, 0);
  const batteryResult = (wantBattery && hasSelections)
    ? calculateBatteryRequirements({
        totalLoadWatts: peakLoadW,
        backupHours,
        batteryPreference: batteryType,
      })
    : null;

  const estimatedCost = systemKW * config.pricePerKW;

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handlePresetQty(id: string, delta: number) {
    const appliance = CATALOG_APPLIANCES.find((a) => a.id === id);
    if (!appliance) return;
    setSelections((prev) => {
      const current = prev[id];
      const newQty = Math.max(0, (current?.qty ?? 0) + delta);
      if (newQty === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { qty: newQty, hours: current?.hours ?? appliance.hoursPerDay } };
    });
  }

  function handlePresetHours(id: string, delta: number) {
    setSelections((prev) => {
      const c = prev[id];
      if (!c) return prev;
      const newHours = Math.min(24, Math.max(0.5, Math.round((c.hours + delta) * 2) / 2));
      return { ...prev, [id]: { ...c, hours: newHours } };
    });
  }

  function handleCustomQty(id: string, delta: number) {
    setCustomAppliances((prev) => prev.map((a) => {
      if (a.id !== id) return a;
      return { ...a, qty: Math.max(0, a.qty + delta) };
    }).filter((a) => a.qty > 0));
  }

  function handleCustomHours(id: string, delta: number) {
    setCustomAppliances((prev) => prev.map((a) => {
      if (a.id !== id) return a;
      const newHours = Math.min(24, Math.max(0.5, Math.round((a.hours + delta) * 2) / 2));
      return { ...a, hours: newHours };
    }));
  }

  function addCustomAppliance(name: string, watts: number, qty: number, hours: number) {
    setCustomAppliances((prev) => [
      ...prev,
      { id: `custom_${Date.now()}`, name, watts, qty, hours },
    ]);
  }

  function handleProceed() {
    setStep('form');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  function handleLeadSubmit(name: string, whatsapp: string) {
    const newLead: Lead = {
      id: Math.random().toString(36).slice(2),
      name,
      whatsapp,
      appliances: allSelected.map((s) => ({
        name: s.name,
        watts: s.watts,
        qty: s.qty,
        hoursPerDay: s.hoursPerDay,
      })),
      dailyKWh,
      systemKW,
      estimatedCost,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    addLead(newLead);
    setSubmittedName(name);
    setStep('done');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const businessName = config.businessName || 'Solar Brand';
  const categoryAppliances = CATALOG_APPLIANCES.filter((a) => a.category === activeCategory);
  const selectedCount = Object.values(selections).filter((s) => s.qty > 0).length + customAppliances.length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#0061FE] flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="font-black text-gray-900 text-sm tracking-tight truncate">{businessName}</span>
          <span className="ml-auto flex-shrink-0 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
            Free Quote
          </span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">

        {/* ── Done screen ────────────────────────────────────────────────── */}
        {step === 'done' ? (
          <ThankYou
            name={submittedName}
            panelKw={panelKw}
            inverterKw={inverterKw}
            batteryCount={batteryResult?.recommendedBatteryCount ?? 0}
            batteryLabel={batteryResult?.batteryTypeLabel ?? ''}
            cost={estimatedCost}
            contactWhatsapp={config.contactWhatsapp}
            businessName={businessName}
          />
        ) : (
          <>
            {/* ── Hero ───────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-5 mb-4 border border-gray-100">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight mb-1.5">
                {config.headline}
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed">{config.subtext}</p>
            </div>

            {/* ── Location ───────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Your Location</p>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <select
                  value={stateKey}
                  onChange={(e) => setStateKey(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#0061FE] focus:bg-white transition-all appearance-none"
                >
                  {STATE_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                Your location affects how much sunlight your panels will get — which changes the system size.
              </p>
            </div>

            {/* ── Appliance catalog ──────────────────────────────────────── */}
            {step === 'calculator' && (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 mb-4 overflow-hidden">
                  <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Select Your Appliances
                      </p>
                      {selectedCount > 0 && (
                        <span className="text-[10px] font-bold bg-[#0061FE] text-white px-2 py-0.5 rounded-full">
                          {selectedCount} added
                        </span>
                      )}
                    </div>
                    {/* Category tabs */}
                    <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
                      {CATEGORY_ORDER.map((cat) => {
                        const isActive = activeCategory === cat;
                        const catCount = CATALOG_APPLIANCES
                          .filter((a) => a.category === cat && (selections[a.id]?.qty ?? 0) > 0).length;
                        return (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
                              isActive
                                ? 'bg-[#0061FE] text-white'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            <span className={isActive ? 'text-white' : 'text-gray-400'}>
                              {CATEGORY_ICONS[cat]}
                            </span>
                            {CATEGORY_LABELS[cat]}
                            {catCount > 0 && (
                              <span className={`text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center ${
                                isActive ? 'bg-white/20 text-white' : 'bg-[#0061FE] text-white'
                              }`}>
                                {catCount}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Appliance rows */}
                  <div>
                    {categoryAppliances.map((appliance, i) => {
                      const sel = selections[appliance.id];
                      const qty = sel?.qty ?? 0;
                      const hours = sel?.hours ?? appliance.hoursPerDay;
                      const isSelected = qty > 0;
                      const isLast = i === categoryAppliances.length - 1;
                      const effectiveWatts = overrides[appliance.id] ?? appliance.watts;
                      return (
                        <div
                          key={appliance.id}
                          className={`transition-colors ${isSelected ? 'bg-blue-50/60' : ''} ${!isLast ? 'border-b border-gray-100' : ''}`}
                        >
                          <div className="flex items-center justify-between px-4 py-3">
                            <div className="min-w-0 mr-4">
                              <p className="text-sm font-semibold text-gray-800">{appliance.name}</p>
                              <p className="text-[11px] text-gray-400">{effectiveWatts}W · default {appliance.hoursPerDay}h/day</p>
                            </div>
                            <Stepper value={qty} min={0} max={20} onChange={(v) => {
                              const delta = v - qty;
                              handlePresetQty(appliance.id, delta);
                            }} />
                          </div>
                          {isSelected && (
                            <div className="px-4 pb-3 flex items-center gap-2">
                              <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>
                              <span className="text-[11px] text-blue-500 font-medium">Hours/day:</span>
                              <Stepper
                                value={hours} min={0.5} max={24} step={0.5}
                                onChange={(v) => handlePresetHours(appliance.id, v - hours)}
                                formatVal={(v) => `${v}h`}
                                size="sm"
                              />
                              {hours !== appliance.hoursPerDay && (
                                <button
                                  onClick={() => handlePresetHours(appliance.id, appliance.hoursPerDay - hours)}
                                  className="ml-auto text-[10px] text-blue-400 hover:text-blue-600"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom appliances (added by user) */}
                {customAppliances.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 mb-4 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Custom Appliances</p>
                    </div>
                    {customAppliances.map((a, i) => (
                      <div
                        key={a.id}
                        className={`${i !== customAppliances.length - 1 ? 'border-b border-gray-100' : ''} bg-blue-50/40`}
                      >
                        <div className="flex items-center justify-between px-4 py-3">
                          <div className="min-w-0 mr-4">
                            <p className="text-sm font-semibold text-gray-800">{a.name}</p>
                            <p className="text-[11px] text-gray-400">{a.watts}W · {a.hours}h/day</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Stepper value={a.qty} min={0} max={20} onChange={(v) => handleCustomQty(a.id, v - a.qty)} />
                          </div>
                        </div>
                        <div className="px-4 pb-3 flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          <span className="text-[11px] text-blue-500 font-medium">Hours/day:</span>
                          <Stepper
                            value={a.hours} min={0.5} max={24} step={0.5}
                            onChange={(v) => handleCustomHours(a.id, v - a.hours)}
                            formatVal={(v) => `${v}h`}
                            size="sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add custom appliance */}
                <button
                  onClick={() => setShowCustomModal(true)}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl py-3.5 text-sm font-semibold text-gray-400 hover:border-[#0061FE] hover:text-[#0061FE] transition-colors mb-4"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add appliance not listed
                </button>

                {/* ── Battery section ─────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-100 mb-4 overflow-hidden">
                  <div className="px-4 py-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Battery Backup</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Keep power on when there&apos;s no sun or grid</p>
                    </div>
                    <button
                      onClick={() => setWantBattery((v) => !v)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${wantBattery ? 'bg-[#0061FE]' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${wantBattery ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>

                  {wantBattery && (
                    <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-4">
                      {/* Battery type */}
                      <div>
                        <p className="text-xs font-bold text-gray-500 mb-2">Battery Type</p>
                        <div className="grid grid-cols-2 gap-2">
                          {([
                            { value: 'TUBULAR_12V_200AH', label: 'Tubular Lead-Acid', sub: '12V / 200Ah — cheaper upfront' },
                            { value: 'LITHIUM_48V_100AH', label: 'Lithium (LiFePO4)', sub: '48V / 100Ah — lasts 3× longer' },
                          ] as const).map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setBatteryType(opt.value)}
                              className={`p-3 rounded-xl border text-left transition-colors ${
                                batteryType === opt.value
                                  ? 'border-[#0061FE] bg-blue-50'
                                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                              }`}
                            >
                              <p className={`text-xs font-bold ${batteryType === opt.value ? 'text-[#0061FE]' : 'text-gray-700'}`}>
                                {opt.label}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{opt.sub}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Backup hours */}
                      <div>
                        <p className="text-xs font-bold text-gray-500 mb-2">
                          Hours of backup needed — <span className="font-black text-gray-700">{backupHours}h</span>
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {[2, 4, 6, 8, 12, 24].map((h) => (
                            <button
                              key={h}
                              onClick={() => setBackupHours(h)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                backupHours === h
                                  ? 'bg-[#0061FE] text-white border-transparent'
                                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {h}h
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Battery result preview */}
                      {batteryResult && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                          <p className="text-xs font-black text-[#0061FE]">
                            {batteryResult.recommendedBatteryCount}× {batteryResult.batteryTypeLabel}
                          </p>
                          <p className="text-[11px] text-blue-400 mt-0.5">
                            {batteryResult.totalSystemVoltage}V bank · {backupHours}h backup at full load
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Live estimate + CTA ─────────────────────────────────── */}
                {hasSelections ? (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
                    <div className="bg-blue-50 border-b border-blue-100 p-4">
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Your Estimate</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div>
                          <p className="text-[10px] text-blue-400 mb-0.5">Daily Energy</p>
                          <p className="text-lg font-black text-[#0061FE]">{dailyKWh} <span className="text-xs">kWh</span></p>
                        </div>
                        <div>
                          <p className="text-[10px] text-blue-400 mb-0.5">Est. Cost</p>
                          <p className="text-lg font-black text-[#0061FE]">{formatNaira(estimatedCost)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-blue-400 mb-0.5">Solar Panels</p>
                          <p className="text-base font-black text-gray-800">{panelKw} kW</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-blue-400 mb-0.5">Inverter</p>
                          <p className="text-base font-black text-gray-800">{inverterKw} kW</p>
                        </div>
                        {batteryResult && (
                          <div className="col-span-2">
                            <p className="text-[10px] text-blue-400 mb-0.5">Battery</p>
                            <p className="text-sm font-bold text-gray-800">
                              {batteryResult.recommendedBatteryCount}× {batteryResult.batteryTypeLabel}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <button
                        onClick={handleProceed}
                        className="w-full flex items-center justify-center gap-2 bg-[#0061FE] text-white font-bold text-sm py-4 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-100"
                      >
                        Get My Full Quote
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-sm text-gray-400 py-2 mb-4">
                    Select your appliances above to see your estimate.
                  </p>
                )}
              </>
            )}

            {/* ── Lead capture form ────────────────────────────────────── */}
            {step === 'form' && (
              <div ref={formRef}>
                {/* Selection recap */}
                <div className="bg-white rounded-2xl border border-gray-100 mb-4 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Selection</p>
                  </div>
                  <div className="px-4 py-3 space-y-1.5 max-h-40 overflow-y-auto">
                    {allSelected.map((s, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-gray-700">{s.name} × {s.qty}</span>
                        <span className="text-gray-400">{s.hoursPerDay}h/day</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Panels / Inverter</span>
                      <span className="font-bold text-gray-700">{panelKw} kW / {inverterKw} kW</span>
                    </div>
                    {batteryResult && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Battery</span>
                        <span className="font-bold text-gray-700">{batteryResult.recommendedBatteryCount}× units</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-gray-700">Estimated Cost</span>
                      <span className="text-sm font-black text-[#0061FE]">{formatNaira(estimatedCost)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                  <h2 className="text-lg font-black text-gray-900 mb-1">Almost there!</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Enter your details and {businessName} will send your full quote via WhatsApp.
                  </p>
                  <LeadForm onSubmit={handleLeadSubmit} />
                </div>

                <button
                  onClick={() => setStep('calculator')}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  Back to appliances
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showCustomModal && (
        <CustomApplianceModal
          onAdd={addCustomAppliance}
          onClose={() => setShowCustomModal(false)}
        />
      )}

      <div className="text-center pb-8 pt-4">
        <p className="text-[10px] text-gray-300">
          Powered by{' '}
          <a href="/" className="text-gray-400 font-semibold hover:text-[#0061FE] transition-colors">Solarsas</a>
        </p>
      </div>

      {/* Support chat widget */}
      <CustomerChat brandName={businessName} />
    </div>
  );
}
