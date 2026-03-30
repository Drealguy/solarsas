'use client';

import { useState, useEffect } from 'react';
import {
  getConfig, saveConfig,
  CATALOG_APPLIANCES, CATEGORY_LABELS, CATEGORY_ORDER,
  type CalcConfig, type ApplianceCategory,
} from '@/lib/calcStore';

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, description, children }: {
  title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? 'bg-[#0061FE]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalculatorSetupPage() {
  const [config, setConfig] = useState<CalcConfig | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [overrideCategory, setOverrideCategory] = useState<ApplianceCategory>('cooling');

  useEffect(() => { setConfig(getConfig()); }, []);

  if (!config) return null;

  function update(patch: Partial<CalcConfig>) {
    setConfig((c) => c ? { ...c, ...patch } : c);
  }

  function setWattOverride(id: string, watts: number | null) {
    setConfig((c) => {
      if (!c) return c;
      const next = { ...c.wattageOverrides };
      if (watts === null) {
        delete next[id];
      } else {
        next[id] = watts;
      }
      return { ...c, wattageOverrides: next };
    });
  }

  function handleSave() {
    if (!config) return;
    saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function togglePublish() {
    if (!config) return;
    const next: CalcConfig = { ...config, published: !config.published };
    setConfig(next);
    saveConfig(next);
  }

  function copyLink() {
    if (!config) return;
    navigator.clipboard.writeText(`${window.location.origin}/${config.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const overrideCount = Object.keys(config.wattageOverrides ?? {}).length;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-xl font-black text-gray-900">Solar Calculator Setup</h1>
          <p className="text-sm text-gray-400 mt-0.5">Configure what your customers see when they visit your link.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
                Copy Link
              </>
            )}
          </button>
          <a
            href={`/${config.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0061FE] bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Preview
          </a>
        </div>
      </div>

      {/* Published status banner */}
      <div className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 mb-6 border ${
        config.published
          ? 'bg-green-50 border-green-100'
          : 'bg-tertiary/10 border-tertiary/25'
      }`}>
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${config.published ? 'bg-green-500' : 'bg-tertiary'}`} />
          <div>
            <p className={`text-sm font-bold ${config.published ? 'text-green-800' : 'text-gray-900'}`}>
              {config.published ? 'Your calculator is live' : 'Your calculator is not published yet'}
            </p>
            <p className={`text-xs mt-0.5 ${config.published ? 'text-green-600' : 'text-neutral'}`}>
              {config.published
                ? `Customers can visit ${config.slug}.solarsas.com and submit leads.`
                : 'Toggle publish to make your calculator link live for customers.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-semibold ${config.published ? 'text-green-700' : 'text-amber-700'}`}>
            {config.published ? 'Live' : 'Draft'}
          </span>
          <Toggle checked={config.published} onChange={togglePublish} />
        </div>
      </div>

      <div className="space-y-5">

        {/* Page appearance */}
        <SectionCard title="Calculator Page" description="What customers see at the top of your calculator">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Headline</label>
              <input
                value={config.headline}
                onChange={(e) => update({ headline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0061FE] focus:bg-white transition-all"
                placeholder="Get Your Free Solar Quote"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subtext</label>
              <textarea
                value={config.subtext}
                onChange={(e) => update({ subtext: e.target.value })}
                rows={2}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0061FE] focus:bg-white transition-all resize-none"
                placeholder="Select your appliances and get an instant quote."
              />
            </div>
          </div>
        </SectionCard>

        {/* Pricing */}
        <SectionCard title="Pricing & Contact" description="How costs are estimated and how customers reach you">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price per kW installed (₦)</label>
              <div className="relative max-w-xs">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">₦</span>
                <input
                  type="number"
                  min={100000}
                  step={50000}
                  value={config.pricePerKW}
                  onChange={(e) => update({ pricePerKW: Number(e.target.value) })}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0061FE] focus:bg-white transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Example: a 3 kW system will show an estimate of ₦{(config.pricePerKW * 3).toLocaleString('en-NG')}.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your WhatsApp Number</label>
              <input
                type="tel"
                value={config.contactWhatsapp}
                onChange={(e) => update({ contactWhatsapp: e.target.value })}
                placeholder="+234 801 234 5678"
                className="w-full max-w-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0061FE] focus:bg-white transition-all"
              />
              <p className="text-xs text-gray-400 mt-2">
                Customers will see a &quot;Chat on WhatsApp&quot; button on their thank-you screen.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Wattage overrides */}
        <SectionCard
          title={`Wattage Overrides${overrideCount > 0 ? ` (${overrideCount} customised)` : ''}`}
          description="Customers see all 38 appliances. Edit wattages here to match the real specs of brands common in your market — your values are used in every customer's calculation."
        >
          {/* Info callout */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 flex gap-2.5">
            <svg className="w-4 h-4 text-[#0061FE] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            <p className="text-xs text-blue-700 leading-relaxed">
              Example: standard catalog says &ldquo;AC 1HP = 750W&rdquo; but the brands you sell draw 850W. Set it to 850 and every customer who selects that AC gets the accurate number.
            </p>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
            {CATEGORY_ORDER.map((cat) => {
              const catOverrides = CATALOG_APPLIANCES
                .filter((a) => a.category === cat && (config.wattageOverrides ?? {})[a.id])
                .length;
              return (
                <button
                  key={cat}
                  onClick={() => setOverrideCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 flex items-center gap-1.5 ${
                    overrideCategory === cat
                      ? 'bg-[#0061FE] text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                  {catOverrides > 0 && (
                    <span className={`text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center ${
                      overrideCategory === cat ? 'bg-white/20 text-white' : 'bg-[#0061FE] text-white'
                    }`}>
                      {catOverrides}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Appliance watt editor */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            {CATALOG_APPLIANCES
              .filter((a) => a.category === overrideCategory)
              .map((appliance, i, arr) => {
                const isLast = i === arr.length - 1;
                const overrideVal = (config.wattageOverrides ?? {})[appliance.id];
                const isModified = overrideVal !== undefined;
                return (
                  <div
                    key={appliance.id}
                    className={`flex items-center gap-3 px-3.5 py-2.5 ${!isLast ? 'border-b border-gray-100' : ''} ${isModified ? 'bg-blue-50/50' : 'bg-white'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{appliance.name}</p>
                      {isModified && (
                        <p className="text-[10px] text-gray-400">default: {appliance.watts}W</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <input
                        type="number"
                        min={1}
                        value={overrideVal ?? appliance.watts}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setWattOverride(appliance.id, v === appliance.watts ? null : v);
                        }}
                        className={`w-16 text-xs text-center border rounded-lg py-1.5 focus:outline-none transition-colors ${
                          isModified
                            ? 'bg-white border-[#0061FE] text-[#0061FE] font-bold'
                            : 'bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                      />
                      <span className="text-[10px] text-gray-400 w-3">W</span>
                      {isModified && (
                        <button
                          onClick={() => setWattOverride(appliance.id, null)}
                          className="text-[10px] text-gray-400 hover:text-red-400 transition-colors ml-1"
                          title="Reset to default"
                        >
                          ↺
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <p className="text-[11px] text-gray-400 mt-3">
            Blue values are your overrides. Click ↺ to reset any appliance back to the standard catalog value.
          </p>
        </SectionCard>

        {/* Save */}
        <div className="flex justify-end pb-8">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-[#0061FE] text-white hover:bg-blue-600'
            }`}
          >
            {saved ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Saved
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </div>

    </div>
  );
}
