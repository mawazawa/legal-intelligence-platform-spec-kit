"use client";
import React, { useMemo, useRef } from 'react';
import { toPng } from 'html-to-image';

export interface CellDatum {
  claim: string;
  type: 'emails' | 'documents' | 'graph';
  count: number;
}

export function EvidenceCluster({ title, cells }: { title: string; cells: CellDatum[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const claims = useMemo(() => Array.from(new Set(cells.map((c) => c.claim))), [cells]);
  const types: Array<CellDatum['type']> = ['emails', 'documents', 'graph'];

  const max = Math.max(1, ...cells.map((c) => c.count));

  const handleDownload = async () => {
    if (!ref.current) return;
    const dataUrl = await toPng(ref.current, { cacheBust: true, backgroundColor: '#ffffff' });
    const link = document.createElement('a');
    link.download = title.replace(/\s+/g, '_').toLowerCase() + '.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="font-medium">{title}</div>
        <button onClick={handleDownload} className="text-xs px-2 py-1 rounded bg-slate-900 text-white">Download PNG</button>
      </div>
      <div ref={ref} className="p-4">
        <div className="text-xs text-slate-600 mb-2">Intensity encodes count of corroborating items.</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr>
                <th className="text-left p-2 border bg-slate-50">Claim \\ Source</th>
                {types.map((t) => (
                  <th key={t} className="p-2 border bg-slate-50 capitalize">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim}>
                  <td className="p-2 border font-medium align-top">{claim}</td>
                  {types.map((t) => {
                    const datum = cells.find((c) => c.claim === claim && c.type === t)!;
                    const pct = Math.round((datum.count / max) * 100);
                    const bg = `hsl(220, 70%, ${100 - Math.round(pct * 0.5)}%)`;
                    return (
                      <td key={t} className="p-0 border">
                        <div className="h-12 flex items-center justify-center" style={{ backgroundColor: pct > 0 ? bg : '#f8fafc' }}>
                          <span className="text-xs font-semibold text-slate-900/80">{datum.count}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-[11px] text-slate-500">
          Caption: Multi-source corroboration heatmap. Darker cells indicate higher evidence density per claim.
        </div>
      </div>
    </div>
  );
}

