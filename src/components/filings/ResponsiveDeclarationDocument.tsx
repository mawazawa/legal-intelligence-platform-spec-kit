import fs from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { buildCitations } from '@/lib/citations';
import { parseAllEmails, type EmailEvent } from '@/lib/ingestion/email-parser';
import fs from 'node:fs/promises';
import path from 'node:path';

async function readDeclaration(): Promise<{ content: string; source: string } | null> {
  const candidates = [
    path.resolve(process.cwd(), 'RESPONSIVE_DECLARATION_FL320_FINAL.md'),
    path.resolve(process.cwd(), 'RESPONSIVE_DECLARATION_FL320.md'),
  ];

  for (const file of candidates) {
    try {
      const content = await fs.readFile(file, 'utf8');
      return { content, source: file };
    } catch {
      /* no-op */
    }
  }

  return null;
}

async function readExhibits() {
  try {
    const file = path.resolve(process.cwd(), '..', 'case-financials', 'exhibits', 'exhibits.json');
    const raw = await fs.readFile(file, 'utf8');
    const data = JSON.parse(raw);
    return data?.exhibits ?? [];
  } catch {
    return [];
  }
}

type EmailCitations = Awaited<ReturnType<typeof buildCitations>>['emailCitations'];
type GraphCitations = Awaited<ReturnType<typeof buildCitations>>['graphCitations'];

function annotateContent(
  base: string,
  exhibits: any[],
  emailCitations: EmailCitations,
  graphCitations: GraphCitations,
) {
  let annotated = base;
  type Ref = { label: string; detail: string };
  const refs: Ref[] = [];
  let exhibitIdx = 0;
  let emailIdx = 0;
  let graphIdx = 0;

  const addRef = (prefix: 'X' | 'E' | 'G', detail: string) => {
    const label = `${prefix}${prefix === 'X' ? ++exhibitIdx : prefix === 'E' ? ++emailIdx : ++graphIdx}`;
    refs.push({ label, detail });
    return label;
  };

  const linkMarker = (marker: string) => `[#${marker}](#ref-${marker})`;

  const addExhibitMarker = (predicate: (ex: any) => boolean, description: string, pattern: RegExp) => {
    const match = exhibits.find(predicate);
    if (!match) return;
    const marker = addRef('X', `Exhibit ${match.no}: ${match.title} — ${match.path}. ${description}`);
    annotated = annotated.replace(pattern, (m) => `${m} ${linkMarker(marker)}`);
  };

  const addEmailMarker = (bucket: string, description: string, pattern: RegExp) => {
    const match = emailCitations.find((c) => (c.id ?? '').startsWith(`${bucket}_`));
    if (!match) return;
    const detail = `${match.title} (${match.date ?? ''}) — ${match.detail}${match.file ? ` — ${match.file}` : ''}${description ? ` — ${description}` : ''}`;
    const marker = addRef('E', detail);
    annotated = annotated.replace(pattern, (m) => `${m} ${linkMarker(marker)}`);
  };

  const addGraphMarker = (description: string, pattern: RegExp) => {
    const match = graphCitations[0];
    if (!match) return;
    const detail = `${description}: ${match.title} (${match.date ?? ''}) — ${match.detail}`;
    const marker = addRef('G', detail);
    annotated = annotated.replace(pattern, (m) => `${m} ${linkMarker(marker)}`);
  };

  addExhibitMarker(
    (ex) => (ex.type ?? '').includes('closing/statement') || /closing statement/i.test(ex.title ?? ''),
    'Net proceeds and settlement line items',
    /\$?280,355\.83(?!\s*\[#X\d+\])/i,
  );

  addExhibitMarker(
    (ex) => (ex.type ?? '').includes('lender/payoff') || /payoff/i.test(ex.title ?? ''),
    'Mortgage payoff satisfied in escrow',
    /(mortgage payoff|payoff|\$?759,364\.32)(?!\s*\[#X\d+\])/i,
  );

  addExhibitMarker(
    (ex) => /statement.*decision|judgment/i.test(ex.title ?? ''),
    'Allocation per court order (65% / 35%)',
    /(65%|35%|statement of decision)(?!\s*\[#X\d+\])/i,
  );

  addEmailMarker('mortgage_relief', 'California Mortgage Relief confirmation', /(mortgage relief|\$?49,262\.84)(?!\s*\[#E\d+\])/i);
  addEmailMarker('continuance', '', /(continuance|postpone|reschedule|adjourn)(?!\s*\[#E\d+\])/i);
  addEmailMarker('counsel_referral', 'Counsel referral chain', /(berman|proos|anderson|macias|paralegal)(?!\s*\[#E\d+\])/i);
  addEmailMarker('appraisal', '', /(appraisal|3525\s*8th|baldino)(?!\s*\[#E\d+\])/i);
  addGraphMarker('Graph event', /(timeline|events?)(?!\s*\[#G\d+\])/i);

  annotated = annotated.replace(/\n##\s+LEGAL AUTHORITIES/gi, '\n<div class="page-break"></div>\n## LEGAL AUTHORITIES');
  annotated = annotated.replace(/\n##\s+CERTIFICATE OF SERVICE/gi, '\n<div class="page-break"></div>\n## CERTIFICATE OF SERVICE');

  if (!refs.length) {
    return annotated;
  }

  const annotatedWithRefs = [
    annotated.trim(),
    '',
    '<div class="page-break"></div>',
    '',
    '## References',
    ...refs.map((ref) => `- <span id="ref-${ref.label}"></span>[${ref.label}] ${ref.detail}`),
  ].join('\n');

  return annotatedWithRefs;
}

async function resolveMboxPath(): Promise<string> {
  const mailDir = path.resolve(process.cwd(), '..', 'Mail');
  try {
    const entries = await fs.readdir(mailDir);
    const mbox = entries.find((f) => f.endsWith('.mbox'));
    if (mbox) return path.join(mailDir, mbox);
  } catch {}
  return path.join(mailDir, 'LEGAL-DIVORCE STUFF-EVIDENCE.mbox');
}

async function gatherData() {
  const mboxPath = await resolveMboxPath();
  const [decl, exhibits, citations, emails] = await Promise.all([
    readDeclaration(),
    readExhibits(),
    buildCitations(),
    parseAllEmails(mboxPath),
  ]);

  const continuanceCount = (emails as EmailEvent[]).filter((e) => /continuance|postpone|reschedule|adjourn/i.test(`${e.subject} ${e.body}`)).length;
  const byActor: Record<string, number> = {};
  (emails as EmailEvent[]).forEach((e) => {
    byActor[e.actor] = (byActor[e.actor] ?? 0) + 1;
  });

  const annotatedContent = decl
    ? annotateContent(decl.content, exhibits, citations.emailCitations, citations.graphCitations)
    : null;

  return {
    declaration: decl,
    exhibits,
    emailCitations: citations.emailCitations,
    graphCitations: citations.graphCitations,
    annotatedContent,
    emailStats: {
      totalEmails: emails.length,
      continuanceCount,
      byActor,
    },
  };
}

interface ResponsiveDeclarationDocumentProps {
  layout?: 'detailed' | 'pleading';
  showSidebars?: boolean;
  id?: string;
}

export async function ResponsiveDeclarationDocument({
  layout = 'detailed',
  showSidebars = true,
  id,
}: ResponsiveDeclarationDocumentProps) {
  const data = await gatherData();
  const doc = data.annotatedContent ?? data.declaration?.content ?? 'Declaration not found.';

  const markdown = (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
      {doc}
    </ReactMarkdown>
  );

  if (layout === 'pleading') {
    return (
      <section id={id} className="my-8 legal-document">
        <div className="pleading-paper">
          <div className="pleading-gutter hidden print:block">
            <ol>{Array.from({ length: 28 }).map((_, i) => (<li key={i + 1}>{i + 1}</li>))}</ol>
          </div>
          <div className="pleading-body prose prose-slate max-w-none">
            {markdown}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div id={id} className="grid lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 rounded-lg border bg-white shadow-sm print:shadow-none print:border-0 print-pleading">
        <div className="p-6 prose prose-slate max-w-none">
          {markdown}
        </div>
      </section>
      {showSidebars && (
        <aside className="lg:col-span-1 space-y-6">
          <div className="rounded-lg border bg-white">
            <div className="p-4 border-b font-medium">Verified Facts (from email corpus)</div>
            <div className="p-4 text-sm">
              <div className="mb-2">Total emails parsed: <span className="font-semibold">{data.emailStats.totalEmails}</span></div>
              <div className="mb-2">Continuance-related emails: <span className="font-semibold">{data.emailStats.continuanceCount}</span></div>
              <div className="mt-3 text-slate-600">By actor</div>
              <div className="mt-1 space-y-1">
                {Object.entries(data.emailStats.byActor).map(([actor, count]) => (
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
              {data.exhibits.length ? (
                data.exhibits.map((ex: any) => (
                  <div key={ex.no} className="px-4 py-2 border-t text-sm">
                    <div className="font-medium">Exhibit {ex.no}: {ex.title}</div>
                    <div className="text-xs text-slate-600">{ex.type} · {ex.pages ?? '—'} pages · {ex.date ?? ''}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-slate-600">No exhibits found. Populate <code>case-financials/exhibits/exhibits.json</code>.</div>
              )}
            </div>
          </div>
          <div className="rounded-lg border bg-white">
            <div className="p-4 border-b font-medium">Evidence Citations — Emails</div>
            <div className="max-h-[40vh] overflow-auto">
              {data.emailCitations.length ? (
                data.emailCitations.map((citation) => (
                  <div key={citation.id} className="px-4 py-3 border-t text-xs">
                    <div className="font-semibold">{citation.title}</div>
                    <div className="text-slate-600">{citation.date ?? ''}</div>
                    <div className="mt-1 text-slate-700">{citation.detail}</div>
                    {citation.file && (
                      <div className="mt-1 text-slate-500">{citation.file}</div>
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
              {data.graphCitations.length ? (
                data.graphCitations.map((citation) => (
                  <div key={citation.id} className="px-4 py-3 border-t text-xs">
                    <div className="font-semibold">{citation.title}</div>
                    <div className="text-slate-600">{citation.date ?? ''}</div>
                    <div className="mt-1 text-slate-700">{citation.detail}</div>
                    {citation.file && (
                      <div className="mt-1 text-slate-500">{citation.file}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-slate-600">Neo4j not connected or no events found.</div>
              )}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
