import React, { Suspense } from 'react';
import Link from 'next/link';
import ResponsiveDeclarationDocument from '@/components/filings/ResponsiveDeclarationDocument';
import RotertDeclarationDocument from '@/components/filings/RotertDeclarationDocument';
import MPADocument from '@/components/filings/MPADocument';
import PrintScaler from '@/components/print/PrintScaler';

const sections = [
  { id: 'responsive', label: 'Responsive Declaration' },
  { id: 'rotert', label: 'Rotert Declaration' },
  { id: 'mpa', label: 'Memo of Points & Authorities' },
  { id: 'evidence', label: 'Evidence & Analytics' },
];

const CourtFilingsPage = () => {
  return (
    <div className="p-6 mx-auto max-w-6xl space-y-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Court Filing Hub</h1>
        <p className="text-slate-600 max-w-2xl">
          All responsive filings, attorney declarations, and supporting analytics consolidated on a single page.
          Use the quick navigation to jump between sections. Printing this page will emit sequential pleading paper pages.
        </p>
        <nav className="sticky top-4 z-40 no-print bg-white/90 backdrop-blur border rounded-lg px-4 py-3 flex flex-wrap gap-3 shadow-sm">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="text-sm font-medium px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50">
              {section.label}
            </a>
          ))}
        </nav>
      </header>

      <section id="responsive" className="space-y-4 cv-auto">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Responsive Declaration (FL-320)</h2>
          <p className="text-slate-600 text-sm">Full annotated responsive declaration rendered on pleading paper.</p>
        </div>
        <Suspense fallback={<div className="text-sm text-slate-600">Loading declaration…</div>}>
          <PrintScaler targetPages={10}>
            {/* Cast layout to satisfy narrowed prop type in this stub implementation */}
            <ResponsiveDeclarationDocument layout={"detailed"} showSidebars={false} />
          </PrintScaler>
        </Suspense>
      </section>

      <section id="rotert" className="space-y-4 page-break cv-auto">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Declaration of Thomas J. Rotert</h2>
          <p className="text-slate-600 text-sm">Counsel’s supporting declaration outlining intended testimony and rebuttal points.</p>
        </div>
        <Suspense fallback={<div className="text-sm text-slate-600">Loading Rotert declaration…</div>}>
          <PrintScaler targetPages={10}>
            <RotertDeclarationDocument />
          </PrintScaler>
        </Suspense>
      </section>

      <section id="mpa" className="space-y-4 page-break cv-auto">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Memorandum of Points and Authorities</h2>
          <p className="text-slate-600 text-sm">Legal argument summary aligned with the responsive declaration.</p>
        </div>
        <Suspense fallback={<div className="text-sm text-slate-600">Loading memorandum…</div>}>
          <PrintScaler targetPages={10}>
            <MPADocument />
          </PrintScaler>
        </Suspense>
      </section>

      <section id="evidence" className="space-y-6 page-break cv-auto">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Evidence & Analytics</h2>
          <p className="text-slate-600 text-sm">Direct access to data visualizations and comparison dashboards supporting the filings.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/analytics/evidence-matrix" className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition">
            <div className="text-sm font-semibold text-slate-800">Evidence Matrix</div>
            <p className="text-xs text-slate-600 mt-2">Corroboration heatmap summarizing evidence density across claims. Includes one-click PNG export.</p>
          </Link>
          <Link href="/analytics/continuances" className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition">
            <div className="text-sm font-semibold text-slate-800">Continuances Attribution</div>
            <p className="text-xs text-slate-600 mt-2">Quantifies continuance-related communications by actor with exportable chart.</p>
          </Link>
          <Link href="/analytics/communications" className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition">
            <div className="text-sm font-semibold text-slate-800">Communication Responsiveness</div>
            <p className="text-xs text-slate-600 mt-2">Average response latency by actor derived from email threads.</p>
          </Link>
          <Link href="/exhibits/packet" className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition">
            <div className="text-sm font-semibold text-slate-800">Exhibit Packet</div>
            <p className="text-xs text-slate-600 mt-2">Auto-numbered exhibit index and table of contents generated from the evidence registry.</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CourtFilingsPage;
