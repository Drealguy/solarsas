'use client';

import { useState, useEffect } from 'react';
import { getLeads, updateLeadStatus, formatNaira, formatNairaFull, type Lead } from '@/lib/calcStore';

const STATUS_STYLES: Record<Lead['status'], string> = {
  new:       'bg-primary/10 text-primary border-primary/20',
  contacted: 'bg-tertiary/10 text-[#7A5800] border-tertiary/25',
  closed:    'bg-green-50 text-green-700 border-green-100',
};

const STATUS_LABELS: Record<Lead['status'], string> = {
  new: 'New', contacted: 'Contacted', closed: 'Closed',
};

function timeAgo(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return 'Just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function LeadDrawer({ lead, onClose, onStatusChange }: {
  lead: Lead;
  onClose: () => void;
  onStatusChange: (status: Lead['status']) => void;
}) {
  const waLink = `https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-[#0061FE] font-black text-sm flex items-center justify-center">
              {lead.name[0]}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{lead.name}</p>
              <p className="text-xs text-gray-400">{lead.whatsapp}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* System summary */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-3">System Estimate</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] text-blue-400 mb-0.5">Daily</p>
                <p className="text-base font-black text-[#0061FE]">{lead.dailyKWh}<span className="text-[10px]"> kWh</span></p>
              </div>
              <div>
                <p className="text-[10px] text-blue-400 mb-0.5">System</p>
                <p className="text-base font-black text-[#0061FE]">{lead.systemKW}<span className="text-[10px]"> kW</span></p>
              </div>
              <div>
                <p className="text-[10px] text-blue-400 mb-0.5">Est. Cost</p>
                <p className="text-base font-black text-[#0061FE]">{formatNaira(lead.estimatedCost)}</p>
              </div>
            </div>
            <div className="border-t border-blue-100 mt-3 pt-3">
              <p className="text-xs font-semibold text-blue-800">{formatNairaFull(lead.estimatedCost)}</p>
            </div>
          </div>

          {/* Appliance breakdown */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Appliances Selected</p>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              {lead.appliances.map((a, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                    i !== lead.appliances.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <span className="text-gray-700">{a.name}</span>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>×{a.qty}</span>
                    <span className="text-gray-300">|</span>
                    <span>{a.watts * a.qty}W</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Update Status</p>
            <div className="flex gap-2">
              {(['new', 'contacted', 'closed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border capitalize transition-colors ${
                    lead.status === s
                      ? STATUS_STYLES[s] + ' border'
                      : 'bg-gray-50 text-neutral border-transparent hover:border-gray-200'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-gray-400">
            Submitted {new Date(lead.createdAt).toLocaleString('en-NG', {
              dateStyle: 'medium', timeStyle: 'short',
            })}
          </p>
        </div>

        {/* Footer action */}
        <div className="p-4 border-t border-gray-100">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-green-600 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.062.527 4.001 1.455 5.692L0 24l6.47-1.425A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.79 9.79 0 0 1-5.045-1.398l-.361-.215-3.843.846.866-3.736-.234-.38A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
            </svg>
            WhatsApp {lead.name.split(' ')[0]}
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<'all' | Lead['status']>('all');

  useEffect(() => { setLeads(getLeads()); }, []);

  function handleStatusChange(status: Lead['status']) {
    if (!selected) return;
    updateLeadStatus(selected.id, status);
    const updated = leads.map((l) => l.id === selected.id ? { ...l, status } : l);
    setLeads(updated);
    setSelected((s) => s ? { ...s, status } : s);
  }

  const filtered = filter === 'all' ? leads : leads.filter((l) => l.status === filter);

  // Stats
  const totalLeads = leads.length;
  const newCount = leads.filter((l) => l.status === 'new').length;
  const totalPipeline = leads.reduce((s, l) => s + l.estimatedCost, 0);
  const avgSystem = totalLeads > 0
    ? Math.round(leads.reduce((s, l) => s + l.systemKW, 0) / totalLeads * 10) / 10
    : 0;

  return (
    <div className="p-4 sm:p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Leads</h1>
        <p className="text-sm text-gray-400 mt-0.5">Every customer who submitted via your calculator.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Leads', value: totalLeads.toString(), sub: 'all time' },
          { label: 'New', value: newCount.toString(), sub: 'unactioned', accent: newCount > 0 },
          { label: 'Pipeline', value: formatNaira(totalPipeline), sub: 'estimated value' },
          { label: 'Avg System', value: avgSystem ? `${avgSystem} kW` : '—', sub: 'per lead' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">{s.label}</p>
            <p className={`text-xl font-black ${s.accent ? 'text-[#0061FE]' : 'text-gray-900'}`}>{s.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {(['all', 'new', 'contacted', 'closed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              filter === tab
                ? 'bg-[#0061FE] text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {tab === 'all' ? `All (${totalLeads})` : STATUS_LABELS[tab as Lead['status']]}
          </button>
        ))}
      </div>

      {/* Leads list */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl py-16 text-center">
          {leads.length === 0 ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-400">No leads yet</p>
              <p className="text-xs text-gray-300 mt-1">Publish your calculator to start getting leads.</p>
            </>
          ) : (
            <p className="text-sm text-gray-400">No {filter} leads.</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((lead) => (
            <button
              key={lead.id}
              onClick={() => setSelected(lead)}
              className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 hover:border-blue-100 hover:bg-blue-50/20 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-[#0061FE] text-sm font-black flex items-center justify-center flex-shrink-0">
                  {lead.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">{lead.name}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${STATUS_STYLES[lead.status]}`}>
                      {STATUS_LABELS[lead.status]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {lead.systemKW} kW · {formatNaira(lead.estimatedCost)} · {timeAgo(lead.createdAt)}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right hidden sm:block">
                  <p className="text-sm font-black text-[#0061FE]">{formatNaira(lead.estimatedCost)}</p>
                  <p className="text-[11px] text-gray-400">{lead.systemKW} kW</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
