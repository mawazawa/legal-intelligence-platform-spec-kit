'use client';
import React, { useEffect, useState, useRef } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { toPng } from 'html-to-image';

type Stats = {
  countsByActor: Record<string, number>;
  continuancesByActor: Record<string, number>;
  avgDaysByActor: Record<string, number>;
};

function BarDays({ label, days, max }: { label: string; days: number; max: number }) {
  const pct = max ? Math.round((days / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-44 text-sm text-slate-700 capitalize">{label}</div>
      <div className="h-5 bg-slate-100 rounded w-full">
        <div className="h-5 bg-emerald-600 rounded" style={{ width: pct + '%' }} />
      </div>
      <div className="w-20 text-right text-sm tabular-nums">{days.toFixed(2)} d</div>
    </div>
  );
}

export default function CommunicationsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/analytics/email-stats').then((r) => r.json()).then(setStats).catch(() => setStats(null));
  }, []);

  const handleDownload = async () => {
    if (!ref.current) return;
    const dataUrl = await toPng(ref.current, { cacheBust: true, backgroundColor: '#ffffff' });
    const a = document.createElement('a');
    a.download = 'communications_responsiveness.png';
    a.href = dataUrl;
    a.click();
  };

  const entries = Object.entries(stats?.avgDaysByActor || {});
  const max = Math.max(1, ...entries.map(([, v]) => v));

  return (
    <DashboardLayout>
      <div className="p-6 mx-auto max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Communication Responsiveness</h1>
          <button onClick={handleDownload} className="no-print text-xs px-2 py-1 rounded bg-slate-900 text-white">Download PNG</button>
        </div>
        <div ref={ref} className="printable rounded border bg-white p-6">
          <div className="text-sm text-slate-600 mb-2">Average response latency by actor (days), computed within email threads (normalized subjects).</div>
          <div className="space-y-2">
            {entries.length ? entries.map(([actor, days]) => (
              <BarDays key={actor} label={actor} days={days} max={max} />
            )) : <div className="text-slate-600 text-sm">No response latency could be computed.</div>}
          </div>
          <div className="mt-3 text-[11px] text-slate-500">Caption: Response latency aggregated across threads when actor switches between consecutive emails. Values shown in days.</div>
        </div>
      </div>
    </DashboardLayout>
  );
}

