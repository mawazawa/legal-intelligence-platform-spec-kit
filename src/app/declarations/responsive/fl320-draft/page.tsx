import fs from 'node:fs/promises';
import path from 'node:path';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';

async function loadFile(file: string) {
  try {
    const p = path.resolve(process.cwd(), file);
    return await fs.readFile(p, 'utf8');
  } catch {
    return null;
  }
}

export default async function FL320DraftWorkspace() {
  const [finalText, draftText, newText] = await Promise.all([
    loadFile('RESPONSIVE_DECLARATION_FL320_FINAL.md'),
    loadFile('RESPONSIVE_DECLARATION_FL320.md'),
    loadFile('RESPONSIVE_DECLARATION_FL320_UPDATED.md'),
  ]);

  if (!finalText && !draftText && !newText) {
    notFound();
  }

  const columns = [
    {
      title: 'Filed Version',
      description: 'Current signed responsive declaration on record.',
      content: finalText ?? 'Not available',
      badge: 'FL-320 Filed',
    },
    {
      title: 'Working Draft',
      description: 'Original markdown draft (prior iterations).',
      content: draftText ?? 'Not available',
      badge: 'Draft',
    },
    {
      title: 'Live Update',
      description: 'Active edit with new tax evidence & lien narrative.',
      content: newText ?? 'Not started',
      badge: 'In Progress',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">FL-320 Responsive Declaration Workspace</h1>
            <p className="text-sm text-slate-500">Side-by-side review: filed copy, legacy draft, and live update for new tax evidence & lien narrative.</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <Badge variant="outline">Case No. FDI-21-794666</Badge>
            <Badge variant="outline">Wauters v. Alvero</Badge>
            <Link href="/rfo-comparison" className="text-blue-600 underline">Back to comparison</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-4 px-6 py-6 lg:grid-cols-3">
        {columns.map(col => (
          <Card key={col.title} className="flex h-[calc(100vh-160px)] flex-col overflow-hidden border border-slate-200">
            <CardHeader className="space-y-2 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-slate-900">{col.title}</CardTitle>
                <Badge>{col.badge}</Badge>
              </div>
              <p className="text-xs text-slate-500">{col.description}</p>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto bg-slate-50 p-0">
              <div className="px-4 py-3">
                <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-slate-800">
                  {col.content}
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
