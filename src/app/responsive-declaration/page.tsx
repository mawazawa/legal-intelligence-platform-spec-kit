import fs from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PrintButton } from '@/components/case/PrintButton';
import { buildCitations } from '@/lib/citations';
import { parseAllEmails } from '@/lib/ingestion/email-parser';

async function readDeclaration(): Promise<{ content: string; source: string } | null> {
  const candidates = [
    path.resolve(process.cwd(), 'RESPONSIVE_DECLARATION_FL320_FINAL.md'),
    path.resolve(process.cwd(), 'RESPONSIVE_DECLARATION_FL320.md'),
  ];

  for (const p of candidates) {
    try {
      const content = await fs.readFile(p, 'utf8');
      return { content, source: p };
    } catch {}
  }
  return null;
}

async function readExhibits() {
  try {
    const p = path.resolve(process.cwd(), '..', 'case-financials', 'exhibits', 'exhibits.json');
    const raw = await fs.readFile(p, 'utf8');
    const data = JSON.parse(raw);
    return data?.exhibits || [];
  } catch {
    return [];
  }
}

export const dynamic = 'force-static';

export default async function ResponsiveDeclarationPage() {
  const decl = await readDeclaration();
  const exhibits = await readExhibits();
  const { emailCitations, graphCitations } = await buildCitations();
  const allEmails = await parseAllEmails();
  const continuanceCount = allEmails.filter((e) => /continuance|postpone|reschedule|adjourn/i.test(`${e.description} ${e.snippet}`)).length;
  const byActor: Record<string, number> = {};
  for (const e of allEmails) {
    byActor[e.actor] = (byActor[e.actor] || 0) + 1;
  }

  // Inline annotation: add bracketed footnote markers and append references
  function annotate(content: string) {
    let annotated = content;
    type Ref = { kind: 'exhibit' | 'email' | 'graph'; label: string; detail: string };
    const refs: Ref[] = [];
    let emailIdx = 0, exhibitIdx = 0, graphIdx = 0;

    const addExhibitRef = (titleMatch: (ex: any) => boolean, description: string) => {
      const ex = exhibits.find(titleMatch);
      if (!ex) return null;
      const marker = `[X${++exhibitIdx}]`;
      refs.push({ kind: 'exhibit', label: marker, detail: `Exhibit ${ex.no}: ${ex.title} — ${ex.path}. ${description}` });
      return marker;
    };

    const pickEmailByBucket = (bucket: string, extra?: string) => {
      const c = emailCitations.find((c) => (c.id || '').startsWith(bucket + '_'));
      if (!c) return null;
      const marker = `[E${++emailIdx}]`;
      refs.push({ kind: 'email', label: marker, detail: `${c.title} (${c.date || ''}) — ${c.detail}${c.file ? ` — ${c.file}` : ''}${extra ? ` — ${extra}` : ''}` });
      return marker;
    };

    const addGraphRef = (title: string) => {
      const g = graphCitations[0];
      if (!g) return null;
      const marker = `[G${++graphIdx}]`;
      refs.push({ kind: 'graph', label: marker, detail: `${title}: ${g.title} (${g.date || ''}) — ${g.detail}` });
      return marker;
    };

    const insertAfterFirst = (regex: RegExp, marker: string) => {
      annotated = annotated.replace(regex, (m) => `${m} ${marker}`);
    };

    // Net proceeds reference → Closing Statement
    const closingMarker = addExhibitRef(
      (ex) => (ex.type || '').includes('closing/statement') || /closing statement/i.test(ex.title || ''),
      'Net proceeds and settlement line items'
    );
    if (closingMarker) {
      insertAfterFirst(/\$?280,355\.83(?!\s*\[X\d+\])/i, closingMarker);
    }

    // Mortgage payoff reference → Lender payoff
    const payoffMarker = addExhibitRef(
      (ex) => (ex.type || '').includes('lender/payoff') || /payoff/i.test(ex.title || ''),
      'Mortgage payoff satisfied in escrow'
    );
    if (payoffMarker) {
      insertAfterFirst(/payoff|mortgage payoff|\$?759,364\.32(?!\s*\[X\d+\])/i, payoffMarker);
    }

    // SOD 65/35 allocation → Judgment/SOD
    const sodMarker = addExhibitRef(
      (ex) => /statement.*decision|judgment/i.test(ex.title || ''),
      'Allocation per court order (65% / 35%)'
    );
    if (sodMarker) {
      insertAfterFirst(/65%|35%|statement of decision(?!\s*\[X\d+\])/i, sodMarker);
    }

    // Mortgage relief (emails)
    const mrelief = pickEmailByBucket('mortgage_relief', 'California Mortgage Relief');
    if (mrelief) insertAfterFirst(/mortgage relief|\$?49,262\.84(?!\s*\[E\d+\])/i, mrelief);

    // Continuances (emails)
    const cont = pickEmailByBucket('continuance');
    if (cont) insertAfterFirst(/continuance|postpone|reschedule|adjourn(?!\s*\[E\d+\])/i, cont);

    // Counsel diligence (emails)
    const counsel = pickEmailByBucket('counsel_referral', 'Counsel referral chain');
    if (counsel) insertAfterFirst(/berman|proos|anderson|macias|paralegal(?!\s*\[E\d+\])/i, counsel);

    // Appraisal emails
    const appr = pickEmailByBucket('appraisal');
    if (appr) insertAfterFirst(/appraisal|3525\s*8th|baldino(?!\s*\[E\d+\])/i, appr);

    // Graph (if present) — attach to first occurrence of "timeline" or "events"
    const gmark = addGraphRef('Graph event');
    if (gmark) insertAfterFirst(/timeline|events?(?!\s*\[G\d+\])/i, gmark);

    if (!refs.length) return content;

    const lines = [annotated.trim(), '', '---', '', '## References'];
    refs.forEach((r) => lines.push(`- ${r.label} ${r.detail}`));
    return lines.join('\n');
  }

  const annotatedContent = decl ? annotate(decl.content) : null;

  return (
    <DashboardLayout>
      <div className="p-6 mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Responsive Declaration (FL-320)</h1>
            <p className="text-slate-600 text-sm">Rendered from Markdown · {decl?.source ? decl.source.replace(process.cwd() + '/', '') : 'missing'}</p>
          </div>
          <PrintButton />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 rounded-lg border bg-white shadow-sm print:shadow-none print:border-0 print-pleading">
            <div className="p-6 prose prose-slate max-w-none">
              {decl ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{annotatedContent || decl.content}</ReactMarkdown>
              ) : (
                <div className="text-slate-600">Declaration file not found. Please add <code>RESPONSIVE_DECLARATION_FL320_FINAL.md</code> to the project root.</div>
              )}
            </div>
          </section>

          <aside className="lg:col-span-1 space-y-6">
            <div className="rounded-lg border bg-white">
              <div className="p-4 border-b font-medium">Verified Facts (from email corpus)</div>
              <div className="p-4 text-sm">
                <div className="mb-2">Total emails parsed: <span className="font-semibold">{allEmails.length}</span></div>
                <div className="mb-2">Continuance-related emails: <span className="font-semibold">{continuanceCount}</span></div>
                <div className="mt-3 text-slate-600">By actor</div>
                <div className="mt-1 space-y-1">
                  {Object.entries(byActor).map(([actor, count]) => (
                    <div key={actor} className="flex justify-between">
                      <span className="capitalize text-slate-600">{actor}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-white">
              <div className="p-4 border-b font-medium">Exhibit Index</div>
              <div className="max-h-[50vh] overflow-auto">
                {exhibits.length ? (
                  exhibits.map((ex: any) => (
                    <div key={ex.no} className="px-4 py-2 border-t text-sm">
                      <div className="font-medium">Exhibit {ex.no}: {ex.title}</div>
                      <div className="text-xs text-slate-600">{ex.type} · {ex.pages ?? '—'} pages · {ex.date || ''}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-sm text-slate-600">No exhibits found. Populate <code>case-financials/exhibits/exhibits.json</code>.</div>
                )}
              </div>
              <div className="p-3 border-t text-right text-sm">
                <a href="/exhibits/packet" className="text-blue-600 hover:underline">View Exhibit Packet →</a>
              </div>
            </div>

            <div className="rounded-lg border bg-white">
              <div className="p-4 border-b font-medium">Evidence Citations — Emails</div>
              <div className="max-h-[40vh] overflow-auto">
                {emailCitations.length ? (
                  emailCitations.map((c) => (
                    <div key={c.id} className="px-4 py-3 border-t text-xs">
                      <div className="font-semibold">{c.title}</div>
                      <div className="text-slate-600">{c.date || ''}</div>
                      <div className="mt-1 text-slate-700">{c.detail}</div>
                      {c.file && (
                        <div className="mt-1 text-slate-500">{c.file}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-sm text-slate-600">No email citations available.</div>
                )}
              </div>
            </div>

            <div className="rounded-lg border bg-white">
              <div className="p-4 border-b font-medium">Evidence Citations — Graph</div>
              <div className="max-h-[40vh] overflow-auto">
                {graphCitations.length ? (
                  graphCitations.map((c) => (
                    <div key={c.id} className="px-4 py-3 border-t text-xs">
                      <div className="font-semibold">{c.title}</div>
                      <div className="text-slate-600">{c.date || ''}</div>
                      <div className="mt-1 text-slate-700">{c.detail}</div>
                      {c.file && (
                        <div className="mt-1 text-slate-500">{c.file}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-sm text-slate-600">Neo4j not connected or no events found.</div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
