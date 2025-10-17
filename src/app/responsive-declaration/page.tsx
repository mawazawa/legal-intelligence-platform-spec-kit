import fs from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PrintButton } from '@/components/case/PrintButton';
import { buildCitations } from '@/lib/citations';

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
          <section className="lg:col-span-2 rounded-lg border bg-white shadow-sm print:shadow-none print:border-0">
            <div className="p-6 prose prose-slate max-w-none">
              {decl ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{decl.content}</ReactMarkdown>
              ) : (
                <div className="text-slate-600">Declaration file not found. Please add <code>RESPONSIVE_DECLARATION_FL320_FINAL.md</code> to the project root.</div>
              )}
            </div>
          </section>

          <aside className="lg:col-span-1 space-y-6">
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

