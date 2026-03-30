'use client';

import { useState, useRef } from 'react';

// TODO: Pre-populate from Supabase: SELECT * FROM tenants WHERE id = auth.uid()
// TODO: On save: UPDATE tenants SET whatsapp=?, logo_url=?, address=?, hero_text=? WHERE id=?

export default function SettingsPage() {
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [heroText, setHeroText] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const BRAND_SLUG = 'mybrand'; // TODO: Pull from tenant session
  const BRAND_NAME = 'MyBrand Solar'; // TODO: Pull from tenant session
  const BRAND_EMAIL = 'admin@mybrand.com'; // TODO: Pull from auth session

  function handleLogoFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleLogoFile(file);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Upload logo to Supabase Storage, then update tenants row
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Brand Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          This information is shown on your public calculator page.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">

        {/* ── Section: Public Calculator Details ── */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-900">Public Calculator Details</h2>
            <p className="text-xs text-gray-400 mt-0.5">Shown to your customers on {BRAND_SLUG}.solarsas.com</p>
          </div>

          <div className="px-6 py-5 flex flex-col gap-5">
            {/* Logo Upload */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                Brand Logo
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${
                  dragging
                    ? 'border-[#0061FE] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {logoPreview ? (
                  <div className="flex flex-col items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoPreview}
                      alt="Brand logo preview"
                      className="h-16 max-w-[200px] object-contain rounded-lg"
                    />
                    <p className="text-xs text-[#0061FE] font-semibold">Click to change</p>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700">
                        Drop your logo here, or <span className="text-[#0061FE]">browse</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG or JPG · Max 2MB · Recommended 200×60px</p>
                    </div>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoFile(f); }}
                />
              </div>
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Business WhatsApp Number <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-0">
                <span className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-500 font-medium whitespace-nowrap">
                  🇳🇬 +234
                </span>
                <input
                  type="tel"
                  placeholder="8012345678"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0061FE]/25 focus:border-[#0061FE] transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Leads will be sent a WhatsApp link to contact this number directly.
              </p>
            </div>

            {/* Business Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Business Address
              </label>
              <input
                type="text"
                placeholder="e.g. 15 Allen Avenue, Ikeja, Lagos"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0061FE]/25 focus:border-[#0061FE] transition-all"
              />
            </div>

            {/* Hero Text */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Hero Text / Tagline
                </label>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">Optional</span>
              </div>
              <textarea
                rows={3}
                placeholder="e.g. Get an instant solar quote in under 60 seconds. No back-and-forth, no hidden fees."
                value={heroText}
                onChange={(e) => setHeroText(e.target.value)}
                maxLength={160}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0061FE]/25 focus:border-[#0061FE] transition-all resize-none"
              />
              <p className="text-xs text-gray-300 mt-1 text-right">{heroText.length}/160</p>
            </div>
          </div>
        </div>

        {/* ── Section: Account Info ── */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-900">Account Info</h2>
          </div>
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Brand Name (read-only) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Brand Name
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
                <span className="text-sm text-gray-500 font-medium">{BRAND_NAME}</span>
                <span className="ml-auto text-[10px] text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">Read-only</span>
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
                <span className="text-sm text-gray-500">{BRAND_EMAIL}</span>
                <span className="ml-auto text-[10px] text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">Read-only</span>
              </div>
            </div>

            {/* Live Link */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Your Calculator Link
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                  <span className="text-sm font-mono text-gray-600">{BRAND_SLUG}.solarsas.com</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(`https://${BRAND_SLUG}.solarsas.com`)}
                  className="px-3 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  title="Copy link"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Changes are reflected on your calculator page immediately after saving.
          </p>
          <button
            type="submit"
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
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
