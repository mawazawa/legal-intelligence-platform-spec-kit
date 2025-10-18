import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { EvidenceCluster } from '@/components/analytics/EvidenceCluster';
import { buildEvidenceClusters, claimLabel } from '@/lib/evidence';

export const dynamic = 'force-dynamic';

export default async function EvidenceMatrixPage() {
  const { cells, suggestions } = await buildEvidenceClusters();

  return (
    <DashboardLayout>
      <div className="p-6 mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Evidence Matrix</h1>
          <p className="text-slate-600 text-sm">Dry, scientific view of corroboration density across claims and sources. Export clusters as PNG for exhibits.</p>
        </div>

        <EvidenceCluster
          title="Claim × Source Corroboration Heatmap"
          cells={cells.map((c) => ({ claim: claimLabel(c.claim), type: c.type, count: c.count }))}
        />

        <div className="rounded-lg border bg-white">
          <div className="p-4 border-b font-medium">Suggested Evidence (Auto-Selected)</div>
          <div className="divide-y">
            {suggestions.map((s, idx) => (
              <div key={idx} className="px-4 py-3 text-sm">
                <div className="font-semibold">{claimLabel(s.claim)}</div>
                <div className="text-slate-700">{s.title}</div>
                <div className="text-slate-600 text-xs">{s.why}{s.date ? ` · ${s.date}` : ''}{s.path ? ` · ${s.path}` : ''}</div>
              </div>
            ))}
            {!suggestions.length && (
              <div className="p-4 text-sm text-slate-600">No suggestions found. Add exhibits or emails.</div>
            )}
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Filing language pattern: “Attached hereto is Visualization Exhibit A: a multi-source corroboration heatmap demonstrating evidence density for [Claim], derived from contemporaneous emails (mbox corpus), documentary exhibits (closing, payoff, appraisal), and graph events. The visualization depicts counts per source; darker cells indicate higher corroboration.”
        </div>
      </div>
    </DashboardLayout>
  );
}

