import fs from 'node:fs/promises';
import path from 'node:path';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollText, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

async function loadJudgmentExcerpt(): Promise<string[]> {
  const candidates = [
    'legal-intelligence-platform/2023-12-28_SOD.txt',
    'legal-intelligence-platform/Judgment_copy_2_OCR.txt',
  ];

  for (const relative of candidates) {
    try {
      const absolute = path.resolve(process.cwd(), '..', relative);
      const raw = await fs.readFile(absolute, 'utf8');
      const lines = raw
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);
      if (lines.length === 0) continue;
      const slice = lines.slice(0, 14);
      return slice;
    } catch {
      // continue to next candidate
    }
  }

  return [];
}

export async function JudgmentContextPanel() {
  const excerpt = await loadJudgmentExcerpt();

  return (
    <div className="space-y-4">
      <Card className="shadow-sm border border-slate-200">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Judgment Snapshot</CardTitle>
          </div>
          <p className="text-xs text-slate-500">
            Keep the Statement of Decision within sight while recalculating distributions.
          </p>
        </CardHeader>
        <CardContent className="bg-slate-50 rounded-lg border border-slate-200">
          {excerpt.length > 0 ? (
            <div className="space-y-1 text-[12px] font-mono text-slate-700 leading-relaxed">
              {excerpt.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Unable to load Statement of Decision extract. Ensure OCR files are present under the project root.
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
              65/35 Split
            </Badge>
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
              Watts Credits
            </Badge>
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
              Arrears Findings
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-200">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <CardTitle className="text-base">Computation Assistant</CardTitle>
          </div>
          <p className="text-xs text-slate-500">
            Ask “what if” questions, compare scenarios, or request supporting evidence summaries.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <ComputationAssistant />
        </CardContent>
      </Card>
    </div>
  );
}

function ComputationAssistant() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">
        Select a scenario in the calculator, then capture clarifications here. Responses pull from the ledger and tagged
        evidence.
      </p>
      <textarea
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        rows={3}
        placeholder="Example: “If we mirror Petitioner’s Form 593, what does the pot split to?”"
      />
      <button className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition">
        Generate Draft Answer
      </button>
      <p className="text-[11px] text-slate-400">
        AI responses summarize graph evidence; always confirm figures before filing.
      </p>
    </div>
  );
}
